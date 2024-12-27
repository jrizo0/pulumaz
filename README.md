# Pulumaz

Monorepo using pulumi for azure infraestructure

# Getting started

After cloning the repo:

- Change all references to `pulumaz` to your project/org name
- Remove the package functions-build-target (was just for reference)
-

# Functions package deployment

I have tried a lot of things but the only way to make the azure functions to recognize the functions is using the current way creating an extra package with the output of the build and installing the package @azure/functions to it like a orphan repo (esbuild + build.sh or tsc + build.sh)
