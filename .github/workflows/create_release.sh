#!/bin/bash

# Required environment variables:
# - GH_TOKEN: GitHub personal access token for write permissions

DIST_DIR=dist
ORIGIN_URL="https://${GITHUB_ACTOR}:${GH_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
RELEASE_BRANCH="release"
VERSION=v$(grep '"version"' package.json | cut -d '"' -f 4 | head -n 1)

echo "Creating release for ${VERSION}..."

# Checkout new branch
if [ `git branch | grep ${RELEASE_BRANCH}` ]; then git branch -D ${RELEASE_BRANCH}; fi
git checkout -b ${RELEASE_BRANCH}

# Build
npm run build
npm prune --production

# Remove unwanted files
find . -maxdepth 1 \
  ! -name '.' \
  ! -name '..' \
  ! -name ${DIST_DIR} \
  ! -name '.git' \
  ! -name 'action.yml' \
  ! -name 'node_modules' \
  ! -name 'package.json' \
  ! -name 'README.md' \
  -exec rm -rf {} \;

# Push to release branch
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git add -fA
git commit --allow-empty -m "$(git log -1 --pretty=%B)"
git push -f --set-upstream ${ORIGIN_URL} ${RELEASE_BRANCH}

# Check if tag already exists
if git ls-remote --tags origin | grep ${VERSION} >/dev/null 2>&1; then
  echo "Failed to create release for ${VERSION}, a tag with the same value already exists"
  exit 1
fi

# Remove local tag if it exists
if git tag -l | grep ${VERSION} >/dev/null 2>&1; then
  git tag -d ${VERSION}
fi

git tag ${VERSION}
git push --tags

gh release create ${VERSION} --generate-notes

MAJOR_TAG="$(cut -d '.' -f 1 <<< "$VERSION")"

git tag -fa $MAJOR_TAG -m "Update $MAJOR_TAG tag"
git push origin $MAJOR_TAG --force

echo "Successfully created release for ${VERSION}"
