#!/bin/bash

COMMIT_MSG="$1"

if [[ -z "$COMMIT_MSG" ]]; then
  echo "ERROR: Empty commit message"
  exit 1
fi

git status 

if [[ $? != 0 ]]; then
  echo "Not in git directory"
  exit 1
fi

git add -A
git commit -m "$COMMIT_MSG"
git push