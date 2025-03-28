# Pulumaz

**Monorepo** using `pulumi` for azure infraestructure, using mainly `bun`, but could be used with other package managers. 
Important to note that azure tools are not that great documentated for monorepos.

This repo is using:

- Azure functions ➡️ Hono api ✅
- Azure Static Web Apps ➡️ Next.js app ✅
- Azure Database for Postgres ➡️ Postgres DB ✅

# Getting started

After cloning the repo:

- Change all references to `pulumaz` to your project or org name
- Remove the package `functions-build-target` (was just for reference for how the output build of the functions pckg should look like)
- Run `az login`
- Run `pulumi org set-default {org-name}`
- Add github secrets: `PULUMI_ACCESS_TOKEN`
- Configure Pulumi.yml file with your pulumi stack name, app name and app description

## If you want to use credentials to deploy
- Create an app registration with (az active-directory service-principle): `az ad sp create-for-rbac --name "pulumaz" --role contributor --scopes /subscriptions/{sub-id} --sdk-auth`
- With the output add github secrets: `AZURE_CLIENT_ID`, `AZURE_CLIENT_SECRET`, `AZURE_SUBSCRIPTION_ID`, `AZURE_TENANT_ID`, `AZURE_CREDENTIALS`

## If you want to use OIDC
- run `./oidc.sh app-name gh-org-name/gh-repo-name ./fics.json`, this will create all needed resources for OIDC, and set up the GH secrets `AZURE_CLIENT_ID`, `AZURE_SUBSCRIPTION_ID`, `AZURE_TENANT_ID` using the GH cli
  - app-name: name of the app registration, this will create an Active Directory App Registration with the name `app-name`
  - gh-org-name/gh-repo-name: the github org and repo name, this will create a service principal with the name `app-name` in the `gh-org-name` org
  - fics.json: the Federated Identity Credentials file containing wich fics to create (for main branch, master branch and pull request branch are set by default)

# Overview

This is an overview of how the repo is built and structured, it includes understandings of the different parts of the repo and some pain points encountered.

## Github actions

### deploy.yml

The workflow does the following:

1. set up bun, node, run bun i
2. run pulumi up
3. get the www name (gets a random name by azure) from pulumi output
4. get the deployment token from azure
5. build and deploy the static web app using previous values
   - this build and deploy is runned by the official Azure/static-web-apps-deploy which uses `npm` by default, you could override the build command but it didn't work for me.
     Also you could disable the build and build the app a step before but it didn't work either. My solution was to keep installs from the monorepo usable for npm as well (because it's used by default).

### swa.yml

1. get variables from pulumi and azure cli (deploy token)
2. build and deploy the static web app using previous values for main branch and pr to new environments. also removes stages when pr is closed
    - running with next.js standalone mode
    - `PRE_BUILD_COMMAND: npm install -g bun && bun install` to install dependencies and use bun
    - `CUSTOM_BUILD_COMMAND: bun run build && cp -r .next/standalone/packages/www/. .next/standalone` to copy the www folder to the .next folder (workaround)
    - set up env vars

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

Only way is to add the env vars in the github action. That's why we pulled all the needed env vars from pulumi and azure cli in a previous step, and then we add them to the `build_and_deploy_job` in the env section.

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
- [script oidc setup](https://github.com/jongio/github-azure-oidc), from script just changed the creating role assignment line adding `--scope /subscriptions/$SUB_ID` (scope is required value)
- [issue swa deployment, monorepo: www referencing another repo, solved by using standalone and copying output](https://github.com/Azure/static-web-apps/issues/1059#issuecomment-1638817705)
- [pulumi/azure-native tsserver issues "solutions"](https://archive.pulumi.com/t/9702735/hi-anyone-else-experiencing-issues-with-the-ts-server-crashi)

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

- [x] Auth azure CLI in github actions using OIDC (recommended by azure)
- [ ] Postgres DB linked to Next.js server-side
