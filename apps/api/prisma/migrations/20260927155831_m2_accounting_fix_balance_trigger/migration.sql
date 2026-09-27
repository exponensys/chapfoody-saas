-- ═════════════════════════════════════════════════════════════════════════════
-- Fix: the balance trigger raised on every journal_entry insert.
--
-- WHAT WAS WRONG
--   The function resolved its target row with a CASE expression:
--
--     target_id := CASE WHEN TG_TABLE_NAME = 'journal_line' THEN NEW.journal_entry_id ELSE NEW.id END;
--
--   plpgsql prepares a statement's field references when it executes that statement, and a CASE is
--   ONE statement — so both branches were resolved against the current row type. On `journal_entry`
--   there is no `journal_entry_id` field, so the trigger raised
--   `record "new" has no field "journal_entry_id"` for every insert. Because the trigger is
--   DEFERRABLE, the error surfaced at COMMIT, which made it look like the transaction was being
--   refused for being unbalanced rather than because the checker itself was broken.
--
-- HOW IT WAS FOUND
--   By a throwaway probe that attempted an INSERT of a balanced entry and expected it to be
--   accepted. The "balanced entry is refused" line is what exposed it. A test asserting only that
--   unbalanced entries fail would have passed the whole time and proved nothing.
--
-- THE FIX
--   Separate statements inside IF branches. A statement in an untaken branch is never prepared, so
--   each branch only ever refers to a field that exists on the table it is running for.
-- ═════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION cf_check_journal_balance() RETURNS trigger
  LANGUAGE plpgsql
  AS $$
DECLARE
  target_id text;
  entry     record;
  sums      record;
BEGIN
  -- Branch by operation first: OLD is unassigned on INSERT and NEW on DELETE, so reading the wrong
  -- one raises. Then branch by table, one statement per branch, so no branch resolves a field that
  -- does not exist on the other table.
  IF TG_OP = 'DELETE' THEN
    IF TG_TABLE_NAME = 'journal_line' THEN
      target_id := OLD.journal_entry_id;
    ELSE
      target_id := OLD.id;
    END IF;
  ELSE
    IF TG_TABLE_NAME = 'journal_line' THEN
      target_id := NEW.journal_entry_id;
    ELSE
      target_id := NEW.id;
    END IF;
  END IF;

  SELECT id, total_debit, total_credit INTO entry FROM journal_entry WHERE id = target_id;

  -- The entry itself was deleted, and its lines cascaded away with it: nothing left to disagree.
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  SELECT COALESCE(sum(debit), 0) AS debit, COALESCE(sum(credit), 0) AS credit
    INTO sums
    FROM journal_line
   WHERE journal_entry_id = target_id;

  IF sums.debit <> sums.credit THEN
    RAISE EXCEPTION 'Journal entry % does not balance: debit % <> credit %',
      entry.id, sums.debit, sums.credit
      USING ERRCODE = 'check_violation';
  END IF;

  IF sums.debit <> entry.total_debit OR sums.credit <> entry.total_credit THEN
    RAISE EXCEPTION 'Journal entry % stores totals (%, %) that disagree with its lines (%, %)',
      entry.id, entry.total_debit, entry.total_credit, sums.debit, sums.credit
      USING ERRCODE = 'check_violation';
  END IF;

  RETURN NULL;
END
$$;

REVOKE ALL ON FUNCTION cf_check_journal_balance() FROM PUBLIC;
