import { field, table, column, pairFields, view, metric, item, csvArtifact, summary } from './lib/product-kit.mjs';
export const product = {
  category:'Event operations',projectNoun:'Seating project',runLabel:'Build seating plan',
  outcome:'Maintain an attendee roster and hard constraints, inspect table assignments and export an event seating sheet.',
  fields:[table('people','Attendee roster',[column('id','Attendee ID'),column('mentor','Mentor','boolean')]),field('tableCount','Number of tables','number'),field('capacity','Seats per table','number'),
    pairFields('together','Must sit together'),pairFields('separate','Must sit separately'),field('mentorPerTable','Require a mentor at every table','boolean'),field('locked','Pinned table assignments','dictionary',{valueType:'number',keyLabel:'Attendee ID',valueLabel:'Table number'})],
  describe(result) {
    const rows=(result.tables || []).flatMap(t=>t.people.map(p=>({table:t.id,id:p.id,mentor:p.mentor})));
    return summary([metric('Status',result.status),metric('Tables',(result.tables||[]).length),metric('Assigned attendees',rows.length)],[
      view('Event seating sheet',[column('table','Table'),column('id','Attendee'),column('mentor','Mentor')],rows),
    ],result.status==='verified' ? result.tables.map(t=>item(`table:${t.id}`,`Review table ${t.id}`,t.people.map(p=>p.id).join(', '))) : [item('constraints','Resolve seating constraints',(result.conflictIds || []).join(', ') || 'Search did not find a valid arrangement within its budget.',true)],{type:'seating',tables:result.tables || []});
  },
  artifacts(result) {
    return [csvArtifact('seating','Event seating sheet',[column('table','Table'),column('id','Attendee'),column('mentor','Mentor')],(result.tables || []).flatMap(t=>t.people.map(p=>({table:t.id,...p}))))];
  },
};
