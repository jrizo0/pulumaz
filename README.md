# Pulumaz

**Monorepo** using `pulumi` for azure infraestructure, using mainly `bun`, but could be used with other package managers. 
Important to note that azure tools are not that great documentated for monorepos.

This repo is using:

- Azure functions ➡️ Hono api ✅
- Azure Static Web Apps ➡️ Next.js app ✅
- Azure Database for Postgres ➡️ Postgres DB ✅

# Getting started

After cloning the repo:

- Change all references to `pulumaz` to your project/org name
- Remove the package `functions-build-target` (was just for reference for how the output build of the functions pckg should look like)
- Add github secrets: `ARM_CLIENT_ID`, `ARM_CLIENT_SECRET`, `ARM_SUBSCRIPTION_ID`, `ARM_TENANT_ID`, `PULUMI_ACCESS_TOKEN`, `AZURE_CREDENTIALS`
  - Create an app registration with (az active-directory service-principle): `az ad sp create-for-rbac --name "pulumaz" --role contributor --scopes /subscriptions/{sub-id} --sdk-auth`

# Overview

This is an overview of how the repo is built and structured, it includes understandings of the different parts of the repo and some pain points encountered.

## Github actions

The workflow does the following:

1. set up bun, node, run bun i
2. run pulumi up
3. get the www name (gets a random name by azure) from pulumi output
4. get the deployment token from azure
5. build and deploy the static web app using previous values
   - this build and deploy is runned by the official Azure/static-web-apps-deploy which uses `npm` by default, you could override the build command but it didn't work for me.
     Also you could disable the build and build the app a step before but it didn't work either. My solution was to keep installs from the monorepo usable for npm as well (because it's used by default).

## Database

It uses Azure Database for Postgres with a flexible server. To connect to it:

```bash
psql $(pulumi stack output DATABASE_URL --show-secrets)
```

## Azure Static Web App (SWA) (Next.js)

### Deployment

The only good way that I found to deploy is using the [Azure/static-web-apps-deploy](https://github.com/Azure/static-web-apps-deploy) action, 
a pain point on this is how to add env vars to the Next.js deployment.

Also I didn't found a way to deploy the zip file using pulumi.

### Connection with DB

Azure provides a managed way to deploy a CRUD api and graphQL api called `swa-db-connection`. We are not using it in this repo. [official tutorial here](https://learn.microsoft.com/en-us/azure/static-web-apps/database-azure-sql?tabs=bash&pivots=static-web-apps-rest)

### Adding env vars

TO-DO

## Azure Functions

### Deployment

I have tried a lot of things but the only way to make the azure functions to recognize the functions is using the current way, meaning:

- create an extra package with the output of the build and installing the package @azure/functions to it like a orphan repo (esbuild + build.sh or tsc + build.sh).
- only works with the linux version of AzureFunctions [see github issue](https://github.com/Azure/azure-functions-nodejs-library/issues/260#issuecomment-2133675709),
- from the [same issue](https://github.com/Azure/azure-functions-nodejs-library/issues/260#issuecomment-2241240564) I got the `build.sh` script.

# Useful resources

Some useful resources researched:

- [different ways to publish Azure Functions](https://stackoverflow.com/questions/59745819/different-ways-to-publish-azure-function)
- [issue @azure/functions-core is only available at runtime](https://github.com/microsoft/ApplicationInsights-node.js/issues/1102)
- [example of deploying azure functions with pulumi](https://tryzero.com/blog/deploying-azure-functions-with-pulumi-and-zero)
- [example pulumi azure postgresql](https://github.com/rgl/pulumi-typescript-azure-native-postgres)

# Roadmap

## Main milestones

- [x] Azure Functions -> Hono api
- [x] Azure StaticWebApp -> Next.js Web App
- [x] Postgres DB linked to api and possible to Next.js server-side
- [ ] Centralized logging
- [ ] Auth
- [ ] Transactional emails
- [ ] Pull request review (preview environments)
  - [x] SWA deployment
  - [ ] Infra deployment, reusing expencive infrastructure

## Nice to have

- [ ] Auth azure CLI in github actions using OIDC (recommended by azure)
- [ ] Postgres DB linked to Next.js server-side
