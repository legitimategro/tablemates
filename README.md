# Tablemates

Constraint-first seating for small events. It handles capacity, must-together pairs, must-separate pairs, and reports an unsatisfied state instead of saving an invalid plan.

This is a synthetic public evaluation project for testing developer indexing. It does not infer personality, gender, status, or social value; it does not sell tickets, run KYC, notify attendees, or claim Electric Capital acceptance. The account owner must review changes before any external submission.

## Run

```sh
npm test
npm start
```

Open `http://localhost:3000`. The search is deterministic for the same input and returns conflict identifiers for direct contradictions.
