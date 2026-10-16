import assert from 'node:assert/strict';
import { assignTables, validateTables } from './app.mjs';
const people = ['A','B','C','D'].map(id => ({ id, name: id }));
const result = assignTables(people, 3, 2, [['A','B']], [['C','D']]);
assert.equal(result.status, '已验证');
assert.deepEqual(validateTables(result, 2), []);
const conflict = assignTables(people, 1, 4, [['A','B']], [['A','B']]);
assert.equal(conflict.status, '冲突');
console.log('tablemates: ok');
