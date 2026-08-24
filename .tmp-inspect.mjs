import ts from 'typescript';
import { readFileSync, writeFileSync } from 'node:fs';
writeFileSync('/tmp/ws.mjs', ts.transpileModule(readFileSync('api/_data/workspace.ts','utf8'),
  { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText);
const W = await import('/tmp/ws.mjs');

console.log('TEAM_GOALS (graph):', W.TEAM_GOALS.length);
for (const g of W.TEAM_GOALS) console.log(`  ${g.id.padEnd(4)} ${g.title.padEnd(28)} status=${g.status} prog=${JSON.stringify(g.progress)} tasks=${g.tasks.length}`);
console.log('\nGOAL_CARDS:', W.GOAL_CARDS.length);
for (const c of W.GOAL_CARDS) console.log(`  ${c.title.padEnd(28)} status=${c.status.label.padEnd(12)} prog=${JSON.stringify(c.progress)}`);
console.log('\ndetailGoals per member:');
for (const m of W.LIST_MEMBERS) console.log(`  ${m.name.padEnd(14)} -> ${m.detailGoals.map(g=>g.title).join(' | ')}`);
console.log('\ndetailGoal field sample:', JSON.stringify(W.LIST_MEMBERS[0].detailGoals[0], null, 1));
console.log('\nTEAM_GOALS task sample:', JSON.stringify(W.TEAM_GOALS[0].tasks[0], null, 1));
console.log('\nunique task titles across TEAM_GOALS:', new Set(W.TEAM_GOALS.flatMap(g=>g.tasks.map(t=>t.title))).size);
console.log('unique task titles across TASK_COLUMNS:', new Set(W.TASK_COLUMNS.flatMap(c=>c.cards.map(t=>t.title))).size);
console.log('unique task titles across detailTasks:', new Set(W.LIST_MEMBERS.flatMap(m=>m.detailTasks.map(t=>t.title))).size);
