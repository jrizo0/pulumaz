# Pulumaz

Monorepo using pulumi for azure infraestructure, using mainly `bun`, but could be used with other package managers.
It's using:

- Azure functions -> hono api

# Getting started

After cloning the repo:

- Change all references to `pulumaz` to your project/org name
- Remove the package `functions-build-target` (was just for reference for how the output build of the functions pckg should look like)
- Add github secrets: `ARM_CLIENT_ID`, `ARM_CLIENT_SECRET`, `ARM_SUBSCRIPTION_ID`, `ARM_TENANT_ID`, `PULUMI_ACCESS_TOKEN`

# Functions package deployment

I have tried a lot of things but the only way to make the azure functions to recognize the functions is using the current way, meaning:

- create an extra package with the output of the build and installing the package @azure/functions to it like a orphan repo (esbuild + build.sh or tsc + build.sh).
- need the linux version of AzureFunctions [see github issue](https://github.com/Azure/azure-functions-nodejs-library/issues/260#issuecomment-2133675709),
- from the [same issue](https://github.com/Azure/azure-functions-nodejs-library/issues/260#issuecomment-2241240564) I got the `build.sh` script.

# Useful links

- https://stackoverflow.com/questions/59745819/different-ways-to-publish-azure-function
- https://github.com/microsoft/ApplicationInsights-node.js/issues/1102
- https://tryzero.com/blog/deploying-azure-functions-with-pulumi-and-zero

# Roadmap

- [ ] Azure StaticWebApp -> Next.js Web App
- [ ] Postgres DB linked to api and possible to Next.js server-side
- [ ] Centralized logging
- [ ] Auth
- [ ] Transactional emails
