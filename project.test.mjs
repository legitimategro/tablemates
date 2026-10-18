import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spec} from './app.mjs';
import {Workspace} from './lib/workspace.mjs';
async function sample(){const input=structuredClone(spec.sample);return input;}

test('project has business forms, review output and actual deliverable formats',async()=>{const input=await sample(),result=await spec.run(input),view=spec.product.describe(result,input),artifacts=spec.product.artifacts(result,input,{runId:'fixture',createdAt:'2026-10-18T00:00:00.000Z'});assert.ok(spec.product.fields.length>=2);assert.ok(view.metrics.length);assert.ok(view.tables.length);assert.ok(artifacts.length);assert.ok(artifacts.every(a=>a.content.length&&a.extension));});

test('business-specific revision and release behavior',async()=>{const input=await sample();const before=await spec.run(input);assert.equal(before.status,'verified');assert.equal(spec.product.describe(before,input).review.filter(i=>i.blocking).length,0);input.separate.push(['A','B']);const after=await spec.run(input);assert.equal(after.status,'conflict');assert.ok(spec.product.describe(after,input).review[0].blocking);});

test('real business result survives project storage, cloning and input restore',async t=>{const dir=mkdtempSync(join(tmpdir(),'tablemates-project-')),config={mode:'local',workspaceDir:dir};let workspace=new Workspace(spec,config,null);t.after(()=>{workspace.close();rmSync(dir,{recursive:true,force:true});});let project=workspace.create({name:'Tablemates acceptance fixture',data:await sample()}),output=await workspace.run(project.id,{revision:project.revision});assert.equal(output.run.state,'complete');const runId=output.run.id;workspace.close();workspace=new Workspace(spec,config,null);const restored=workspace.runDetail(project.id,runId);assert.deepEqual(restored.result,output.run.result);assert.ok(restored.downloads.length>=2);const duplicate=workspace.clone(project.id,{revision:workspace.get(project.id).revision});assert.equal(duplicate.runs.length,0);assert.deepEqual(duplicate.data,restored.input);});
