/**
 * generate-erd.mjs — build the ERD from the Prisma schema, as Mermaid, into docs/erd/.
 *
 * ── Why generated rather than drawn ──────────────────────────────────────────
 * A hand-drawn ERD of 135 tables is wrong the moment someone adds a field, and nobody notices. This
 * one is derived from the same files Prisma reads, so `pnpm db:erd:check` can fail CI when the two
 * disagree — which is the only property that makes a committed diagram worth committing.
 *
 * ── Why one diagram per domain rather than one of everything ─────────────────
 * 135 tables in a single Mermaid graph is unreadable in a browser and useless in a review. The schema
 * is already split by domain for exactly this reason, so the diagrams follow the split: one per
 * `prisma/models/*.prisma`, plus an index. Cross-domain relations appear in each domain's diagram as
 * edges to a table that is not declared there, which Mermaid renders as a plain box — deliberately,
 * so a reader can see that the edge leaves the domain.
 *
 * ── Why no dependency ────────────────────────────────────────────────────────
 * The alternative is prisma-erd-generator plus a headless browser to rasterise it. This emits text
 * that Git can diff, that a Markdown viewer renders, and that needs nothing installed — which is what
 * makes a CI check cheap enough to actually keep.
 *
 * Usage:
 *   node scripts/generate-erd.mjs            write docs/erd/
 *   node scripts/generate-erd.mjs --check    compare, exit 1 if stale (used by CI)
 */

import { readdirSync, readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const MODELS_DIR = join(here, '..', 'prisma', 'models');
const OUTPUT_DIR = join(here, '..', '..', '..', 'docs', 'erd');

const check = process.argv.includes('--check');

/** Prisma scalar types, mapped to something short enough to read in a diagram. */
const SCALARS = {
  String: 'string',
  Int: 'int',
  BigInt: 'bigint',
  Float: 'float',
  Decimal: 'decimal',
  Boolean: 'boolean',
  DateTime: 'datetime',
  Json: 'json',
  Bytes: 'bytes',
};

/**
 * Parses one `model X { ... }` block.
 *
 * A small line parser rather than a full Prisma grammar: the schema files are formatted by
 * `prisma format`, so one field per line is guaranteed, and everything a diagram needs is on the line
 * it belongs to.
 */
function parseModel(name, body) {
  const fields = [];
  const uniques = [];
  let table = name;

  for (const raw of body.split('\n')) {
    const line = raw.trim();

    if (line === '' || line.startsWith('//') || line.startsWith('///')) {
      continue;
    }

    if (line.startsWith('@@')) {
      const map = /^@@map\("([^"]+)"\)/.exec(line);
      if (map !== null) {
        table = map[1];
      }

      const unique = /^@@unique\(\[([^\]]+)\]\)/.exec(line);
      if (unique !== null) {
        uniques.push(unique[1].split(',').map((part) => part.trim()));
      }

      continue;
    }

    const field = /^(\w+)\s+([\w.]+)(\[\])?(\?)?\s*(.*)$/.exec(line);
    if (field === null) {
      continue;
    }

    const [, fieldName, baseType, isList, isOptional, attributes] = field;

    fields.push({
      name: fieldName,
      type: baseType,
      isList: isList !== undefined,
      isOptional: isOptional !== undefined,
      isId: attributes.includes('@id'),
      isUnique: attributes.includes('@unique'),
      relation: /@relation\(/.test(attributes),
      /** The owning side of a relation: the model that holds the foreign key. */
      ownsRelation: /@relation\([^)]*fields:/.test(attributes),
      foreignKeyColumns: (/@relation\([^)]*fields:\s*\[([^\]]+)\]/.exec(attributes)?.[1] ?? '')
        .split(',')
        .map((part) => part.trim())
        .filter((part) => part !== ''),
    });
  }

  return { name, table, fields, uniques };
}

const files = readdirSync(MODELS_DIR)
  .filter((file) => file.endsWith('.prisma') && file !== 'schema.prisma')
  .sort();

const modelsByName = new Map();
const byFile = new Map();

for (const file of files) {
  const source = readFileSync(join(MODELS_DIR, file), 'utf8');
  const parsed = [];

  for (const match of source.matchAll(/^model\s+(\w+)\s*\{([\s\S]*?)^\}/gm)) {
    const model = parseModel(match[1], match[2]);
    modelsByName.set(model.name, model);
    parsed.push(model);
  }

  if (parsed.length > 0) {
    byFile.set(file, parsed);
  }
}

const modelNames = new Set(modelsByName.keys());

/** Every column that some relation points at, so the FK marker can be applied. */
const foreignKeyColumns = new Set();
for (const model of modelsByName.values()) {
  for (const field of model.fields) {
    if (field.ownsRelation) {
      for (const column of field.foreignKeyColumns) {
        foreignKeyColumns.add(`${model.name}.${column}`);
      }
    }
  }
}

/** The Mermaid type for a field, and whether it is a relation rather than a column. */
function typeOf(field) {
  if (modelNames.has(field.type)) {
    return { mermaid: field.type, isRelation: true };
  }

  return { mermaid: SCALARS[field.type] ?? field.type, isRelation: false };
}

/**
 * The cardinality marker for an edge, from the child's point of view.
 *
 * One-to-one when the foreign key columns are themselves declared unique — which is how a one-to-one
 * relation is expressed in Prisma, and the distinction a reader most needs to see: it decides whether
 * the child may have several rows per parent.
 */
function relationCardinality(child, field) {
  const key = [...field.foreignKeyColumns].sort().join(',');
  const isUnique = child.uniques.some((parts) => [...parts].sort().join(',') === key);

  if (isUnique) {
    return field.isOptional ? '||--o|' : '||--||';
  }

  return field.isOptional ? '||--o{' : '||--|{';
}

function renderModel(model) {
  const lines = [`  ${model.name} {`];

  for (const field of model.fields) {
    const { mermaid, isRelation } = typeOf(field);

    // Relation fields are edges, not columns: drawing them as attributes would duplicate the foreign
    // key that already appears as a scalar field.
    if (isRelation) {
      continue;
    }

    const keys = [];
    if (field.isId) keys.push('PK');
    if (field.isUnique) keys.push('UK');
    if (foreignKeyColumns.has(`${model.name}.${field.name}`)) keys.push('FK');

    const type = field.isList ? `${mermaid}[]` : mermaid;
    lines.push(`    ${type} ${field.name}${keys.length > 0 ? ` ${keys.join(',')}` : ''}`);
  }

  lines.push('  }');

  return lines.join('\n');
}

function renderDomain(file, models) {
  const edges = [];
  const seen = new Set();

  for (const model of models) {
    for (const field of model.fields) {
      if (!modelNames.has(field.type) || !field.ownsRelation) {
        continue;
      }

      const target = modelsByName.get(field.type);
      const label = `${model.table}.${field.name}`;
      const edge = `  ${target.name} ${relationCardinality(model, field)} ${model.name} : "${label}"`;

      if (!seen.has(edge)) {
        seen.add(edge);
        edges.push(edge);
      }
    }
  }

  return [
    '<!-- GENERATED by apps/api/scripts/generate-erd.mjs — do not edit by hand. -->',
    '',
    `# ${file.replace('.prisma', '')} (${models.length} models)`,
    '',
    'An edge to a box that is not declared in this file is a relation leaving this domain — which is',
    'deliberate, so a cross-domain dependency is visible rather than implied. `PK`/`UK`/`FK` mark the',
    'key columns. Regenerate with `pnpm db:erd`; CI fails if this file is stale.',
    '',
    '```mermaid',
    'erDiagram',
    ...edges.sort(),
    '',
    ...models.map(renderModel),
    '```',
    '',
  ].join('\n');
}

const outputs = new Map();

for (const [file, models] of byFile) {
  outputs.set(`${file.replace('.prisma', '')}.md`, renderDomain(file, models));
}

outputs.set(
  'README.md',
  [
    '<!-- GENERATED by apps/api/scripts/generate-erd.mjs — do not edit by hand. -->',
    '',
    '# Entity-relationship diagrams',
    '',
    `Generated from \`apps/api/prisma/models/*.prisma\`: **${modelsByName.size} models across ${byFile.size} domains**.`,
    '',
    'One diagram per domain, because 135 tables in a single graph is unreadable in a browser and',
    'useless in a review. Regenerate with `pnpm db:erd`; `pnpm db:erd:check` fails CI when these files',
    'are stale, so the diagrams cannot drift from the schema.',
    '',
    '| Domain | Models |',
    '| --- | --- |',
    ...[...byFile.entries()]
      .sort()
      .map(
        ([file, models]) =>
          `| [${file.replace('.prisma', '')}](./${file.replace('.prisma', '')}.md) | ${models.length} |`,
      ),
    '',
  ].join('\n'),
);

if (check) {
  const stale = [];

  for (const [name, content] of outputs) {
    const path = join(OUTPUT_DIR, name);
    const current = existsSync(path) ? readFileSync(path, 'utf8') : null;

    if (current !== content) {
      stale.push(name);
    }
  }

  if (stale.length > 0) {
    process.stderr.write(
      `The ERD is stale: ${stale.join(', ')}\nRun \`pnpm db:erd\` and commit the result.\n`,
    );
    process.exit(1);
  }

  process.stdout.write(`The ERD is current (${outputs.size} files).\n`);
} else {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const [name, content] of outputs) {
    writeFileSync(join(OUTPUT_DIR, name), content, 'utf8');
  }

  process.stdout.write(
    `Wrote ${outputs.size} files to docs/erd/ (${modelsByName.size} models across ${byFile.size} domains).\n`,
  );
}

