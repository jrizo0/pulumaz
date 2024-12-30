# Pulumaz

**Monorepo** using pulumi for azure infraestructure, using mainly `bun`, but could be used with other package managers. Important to note that
azure tools are not that great documentated for monorepos.
It's using:

- Azure functions ➡️ Hono api ✅
- Azure Static Web Apps ➡️ Next.js app ✅

# Getting started

After cloning the repo:

- Change all references to `pulumaz` to your project/org name
- Remove the package `functions-build-target` (was just for reference for how the output build of the functions pckg should look like)
- Add github secrets: `ARM_CLIENT_ID`, `ARM_CLIENT_SECRET`, `ARM_SUBSCRIPTION_ID`, `ARM_TENANT_ID`, `PULUMI_ACCESS_TOKEN`, `AZURE_CREDENTIALS`
  - Create an app registration with (az active-directory service-principle): `az ad sp create-for-rbac --name "pulumaz" --role contributor --scopes /subscriptions/{sub-id} --sdk-auth`

# Overview

## Github actions

1. set up bun, node, run bun i
2. run pulumi up
3. get the www name (gets a random name by azure) from pulumi output
4. get the deployment token from azure
5. build and deploy the static web app using previous values
   - this build and deploy is runned by the official Azure/static-web-apps-deploy which uses `npm` by default, you could override the build command but it didn't work for me.
     Also you could disable the build and build the app a step before but it didn't work either. My solution was to keep installs from the monorepo usable for npm as well (because it's used by default).

# Functions package deployment

I have tried a lot of things but the only way to make the azure functions to recognize the functions is using the current way, meaning:

- create an extra package with the output of the build and installing the package @azure/functions to it like a orphan repo (esbuild + build.sh or tsc + build.sh).
- need the linux version of AzureFunctions [see github issue](https://github.com/Azure/azure-functions-nodejs-library/issues/260#issuecomment-2133675709),
- from the [same issue](https://github.com/Azure/azure-functions-nodejs-library/issues/260#issuecomment-2241240564) I got the `build.sh` script.

# Useful links

Some useful links that are not that easy to find:

- https://stackoverflow.com/questions/59745819/different-ways-to-publish-azure-function
- https://github.com/microsoft/ApplicationInsights-node.js/issues/1102
- https://tryzero.com/blog/deploying-azure-functions-with-pulumi-and-zero

# Roadmap

- [x] Azure StaticWebApp -> Next.js Web App
- [ ] Postgres DB linked to api and possible to Next.js server-side
- [ ] Centralized logging
- [ ] Auth
- [ ] Transactional emails
- [ ] Auth azure using OIDC (recommended by azure)
