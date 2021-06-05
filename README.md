# ReactorJS

Generate docs in realtime

## husky lint-staged

- `yarn add -D husky`
- `npm set-script prepare "husky install" && yarn prepare`
- `npx husky add .husky/pre-commit "yarn lint-staged"`
- `git commit -m "added husky and lint-stagged"`
