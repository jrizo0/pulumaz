#!/bin/bash

BUILD_DIR=functions-build
rimraf $BUILD_DIR
rimraf ../$BUILD_DIR
mkdir $BUILD_DIR
cp -r dist $BUILD_DIR
cp host.json $BUILD_DIR
cp local.settings.json $BUILD_DIR

jq '.name = "@pulumaz/functions-build" | del(.devDependencies) | .dependencies = {"@azure/functions": .dependencies."@azure/functions"}' package.json > temp.json && mv temp.json $BUILD_DIR/package.json

mv $BUILD_DIR ../
cd ../$BUILD_DIR
npm install --workspaces=false --omit=dev

# bun install --workspaces=false --omit=dev # not working, uses the node_modules from the root
# npm install --workspaces=false --omit=dev
