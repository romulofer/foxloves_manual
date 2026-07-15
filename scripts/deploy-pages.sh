#!/usr/bin/env bash
# Local build + deploy to the gh-pages branch.
#
# Screenshots need love2d + a display, so the build runs on your machine
# (not CI). This force-pushes the built `build/` output to `gh-pages`;
# GitHub Pages serves that branch at https://romulofer.github.io/foxloves_manual/.
set -euo pipefail

cd "$(dirname "$0")/.."

REMOTE=$(git remote get-url origin)
BRANCH=gh-pages

echo "==> Building (NODE_ENV=production so paths.base is applied)"
NODE_ENV=production bun run build

test -f build/index.html || { echo "build/index.html missing — build failed"; exit 1; }
test -f build/.nojekyll  || { echo "build/.nojekyll missing — _app/ would be stripped by Pages"; exit 1; }

echo "==> Publishing build/ to $BRANCH on $REMOTE"
COMMIT=$(git rev-parse --short HEAD)
(
  cd build
  rm -rf .git
  git init -q
  git checkout -q -b "$BRANCH"
  git add -A
  git -c user.name="deploy" -c user.email="deploy@local" commit -qm "deploy: $COMMIT"
  git push -f "$REMOTE" "$BRANCH"
  rm -rf .git
)

echo "==> Done. Set Pages source to branch '$BRANCH' / root if not already:"
echo "    gh api -X POST repos/romulofer/foxloves_manual/pages -f source.branch=$BRANCH -f source.path=/"
