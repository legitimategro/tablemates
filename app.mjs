import { fileURLToPath } from 'node:url';
import { start } from './lib/server.mjs';
import { run, validate } from './core.mjs';
import { product } from './project.mjs';
export * from './core.mjs';
export const spec = { ...{
  "slug": "tablemates",
  "repo": "tablemates",
  "owner": "legitimategro",
  "title": "Tablemates",
  "purpose": "Build an event seating plan from explicit hard constraints",
  "workflow": "Kite event agents can purchase a bounded constraint search. The service reports failure rather than presenting an invalid seating plan.",
  "colors": [
    "#fcf3e8",
    "#4a2f32",
    "#a53e43"
  ],
  "required": [
    "people",
    "tableCount",
    "capacity"
  ],
  "sample": {
    "people": [
      {
        "id": "A",
        "mentor": true
      },
      {
        "id": "B",
        "mentor": false
      },
      {
        "id": "C",
        "mentor": true
      },
      {
        "id": "D",
        "mentor": false
      }
    ],
    "tableCount": 2,
    "capacity": 2,
    "together": [
      [
        "A",
        "B"
      ]
    ],
    "separate": [
      [
        "C",
        "B"
      ]
    ],
    "mentorPerTable": true,
    "locked": {}
  },
  "changed": "Transitive must-together components, direct contradiction IDs, per-table mentor constraints, pinned assignments and a fixed search-node budget.",
  "limits": "No social scoring, inferred characteristics, ticketing or attendee messages. Not-found within budget is not a mathematical infeasibility proof.",
  "version": "0.3.0",
  "inputSchema": {
    "type": "object",
    "required": [
      "people",
      "tableCount",
      "capacity"
    ],
    "properties": {
      "people": {
        "type": "array"
      },
      "tableCount": {
        "type": "integer"
      },
      "capacity": {
        "type": "integer"
      },
      "together": {
        "type": "array"
      },
      "separate": {
        "type": "array"
      },
      "mentorPerTable": {
        "type": "boolean"
      },
      "locked": {
        "type": "object"
      }
    }
  }
}, run, validate, product };
if (process.argv[1] === fileURLToPath(import.meta.url)) start(spec);

