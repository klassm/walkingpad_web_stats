# Agent rules

These rules apply to every session working in this repository.
- **Always run the linter before committing and fix every failure.** The
  project linter is Biome; run it with `npm run lint`. Apply fixes with
  `npx biome check --write .` when they are formatting/organize-imports
  changes, and manually when they are semantic. A commit must leave
  `npm run lint` passing.
