import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";
import * as random from "@pulumi/random";

const token = new random.RandomPassword("wwwDeploymentToken", {
  length: 32,
  special: false,
});

// Create an Azure Resource Group
const resourceGroup = new azure.resources.ResourceGroup("resourceGroup", {
  location: "eastus2",
});

// Create an Azure Static Web App
const staticWebApp = new azure.web.StaticSite("wwwappnextjs", {
  resourceGroupName: resourceGroup.name,
  location: resourceGroup.location,
  sku: {
    name: "Free",
    tier: "Free",
  },
  repositoryUrl: "https://github.com/jrizo0/pulumaz",
  branch: "main",
  buildProperties: {
    appLocation: "packages/www/",
    outputLocation: "packages/www/.next",
    appBuildCommand: "npm run build --workspace=@pulumaz/www", // npm
    // appBuildCommand: "bun run --filter '*/www' build", // bun
  },
});

// Can get the deployment token from the output of the static web app
/*
const staticApp_secrets = staticWebApp.id.apply(() => // assert staticApp is created
  azure.web.listStaticSiteSecretsOutput({
    resourceGroupName: resourceGroup.name,
    name: staticWebApp.name,
  })
);
const deploymentToken = staticApp_secrets.properties.apply((properties) => properties.apiToken);
*/

// Export the URL of the static web app
export const outputs = {
  www: pulumi.interpolate`https://${staticWebApp.defaultHostname}`,
  wwwName: staticWebApp.name,
};
