import { insist, list, integer, unique } from './lib/validation.mjs';
export function assignTables(people, tableCount, capacity, together = [], separate = [], options = {}) {
  list(people, 'people', 80); unique(people); integer(tableCount, 'tables', 1, 12); integer(capacity, 'capacity', 1, 80);
  const byId = new Map(people.map(p => [p.id, p])), parents = new Map(people.map(p => [p.id, p.id]));
  const root = id => { insist(parents.has(id), `Unknown participant: ${id}`); return parents.get(id) === id ? id : root(parents.get(id)); };
  for (const pair of list(together, 'together', 200)) { insist(pair.length === 2, 'Pair must contain two IDs'); parents.set(root(pair[1]), root(pair[0])); }
  const forbidden = list(separate, 'separate', 200).map(([a, b], i) => { insist(byId.has(a) && byId.has(b), 'Unknown separation participant'); return { a, b, id: `separate-${i}` }; });
  const contradictions = forbidden.filter(p => root(p.a) === root(p.b));
  if (contradictions.length) return { status: 'conflict', conflictIds: contradictions.map(p => p.id), tables: [] };
  const map = new Map();
  for (const p of people) { const id = root(p.id); if (!map.has(id)) map.set(id, []); map.get(id).push(p); }
  const groups = [...map.values()].sort((a, b) => Number(b.some(p => p.mentor)) - Number(a.some(p => p.mentor)) || b.length - a.length || a[0].id.localeCompare(b[0].id));
  const locked = options.locked || {}, tables = Array.from({ length: tableCount }, (_, i) => ({ id: i + 1, people: [] }));
  for (const [id, table] of Object.entries(locked)) { insist(byId.has(id), 'Unknown locked participant'); integer(table, 'locked table', 1, tableCount); }
  let nodes = 0;
  const valid = () => tables.every(t => t.people.length <= capacity && (!options.mentorPerTable || t.people.some(p => p.mentor))) && !forbidden.some(p => tables.some(t => t.people.some(v => v.id === p.a) && t.people.some(v => v.id === p.b)));
  function search(i) {
    if (++nodes > 100000) return false;
    if (i === groups.length) return valid();
    const group = groups[i], groupIds = new Set(group.map(p => p.id)), pinned = new Set(group.map(p => locked[p.id]).filter(Boolean));
    if (pinned.size > 1) return false;
    for (const t of tables.slice().sort((a, b) => a.people.length - b.people.length || a.id - b.id)) {
      if ((pinned.size && !pinned.has(t.id)) || t.people.length + group.length > capacity) continue;
      const current = new Set(t.people.map(p => p.id));
      if (forbidden.some(p => (groupIds.has(p.a) && current.has(p.b)) || (groupIds.has(p.b) && current.has(p.a)))) continue;
      t.people.push(...group);
      if (search(i + 1)) return true;
      t.people.splice(t.people.length - group.length, group.length);
    }
    return false;
  }
  const found = search(0);
  return { status: found ? 'verified' : 'not-found-within-budget', tables: found ? tables : [], searchedNodes: nodes, optimal: false };
}
export function run(x) { return assignTables(x.people, x.tableCount, x.capacity, x.together, x.separate, { locked: x.locked, mentorPerTable: x.mentorPerTable }); }
export function validate(x) { run(x); }
