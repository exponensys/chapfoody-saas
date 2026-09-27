-- ═════════════════════════════════════════════════════════════════════════════
-- Row-level security for HR and payroll.
--
-- One line again: nothing here has a rule beyond tenancy. It is worth saying WHY that is true rather
-- than assuming it — a payroll record is the most sensitive data the platform holds (salaries,
-- addresses, dates of birth), and the temptation might be to add a stricter policy. But the isolation
-- that matters is already the tenant one: an employee's salary must be invisible to every other
-- business, and within one business the question of who may see it is authorization, which the API
-- answers with a role check rather than a row filter.
--
-- That distinction is deliberate and worth keeping straight: row-level security is about WHICH
-- TENANT, the application is about WHICH ROLE. Trying to express "managers only" as a policy would
-- mean encoding the whole RBAC model in SQL, twice.
-- ═════════════════════════════════════════════════════════════════════════════

SELECT cf_apply_tenant_rls();
