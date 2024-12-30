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
  repositoryToken: token.result,
  buildProperties: {
    appLocation: "packages/www/",
    outputLocation: "packages/www/.next",
    // appBuildCommand: "npm run build:www"
    appBuildCommand: "bun run --filter '*/www' build"
  },
});

// Export the URL of the static web app
export const outputs = {
  www: pulumi.interpolate`https://${staticWebApp.defaultHostname}`,
}
