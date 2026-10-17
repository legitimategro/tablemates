import test from 'node:test'; import assert from 'node:assert/strict'; import { assignTables } from './core.mjs';
const people = ['A', 'B', 'C', 'D'].map((id, i) => ({ id, mentor: i === 0 || i === 2 }));
test('transitive together relationships cannot silently split', () => { const r = assignTables(people, 2, 3, [['A', 'B'], ['B', 'C']]); assert.equal(r.status, 'verified'); assert.ok(r.tables.some(t => ['A', 'B', 'C'].every(id => t.people.some(p => p.id === id)))); });
test('transitive separation contradiction returns constraint ID', () => { const r = assignTables(people, 2, 3, [['A', 'B'], ['B', 'C']], [['A', 'C']]); assert.equal(r.status, 'conflict'); assert.deepEqual(r.conflictIds, ['separate-0']); });
test('capacity, mentors and fixed assignments all checked', () => {
  const r = assignTables(people, 2, 2, [], [], { mentorPerTable: true, locked: { A: 2 } });
  assert.equal(r.status, 'verified'); assert.ok(r.tables.every(t => t.people.length <= 2 && t.people.some(p => p.mentor))); assert.ok(r.tables[1].people.some(p => p.id === 'A'));
});
test('fixed 48-person fixture meets six table capacities and mentors', () => {
  const ps = Array.from({ length: 48 }, (_, i) => ({ id: `p${i}`, mentor: i < 6 })); const r = assignTables(ps, 6, 8, [], [], { mentorPerTable: true });
  assert.equal(r.status, 'verified'); assert.ok(r.tables.every(t => t.people.length === 8 && t.people.some(p => p.mentor)));
});
