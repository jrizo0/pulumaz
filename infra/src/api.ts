import * as azurenative from "@pulumi/azure-native";
import * as pulumi from "@pulumi/pulumi";
import { getConnectionString, signedBlobReadUrl } from "./helpers";
import { local } from "@pulumi/command";

const resourceGroup = new azurenative.resources.ResourceGroup("resourcegroup", {
  location: "canadacentral",
});

const storageAccount = new azurenative.storage.StorageAccount(
  "storageaccount",
  {
    resourceGroupName: resourceGroup.name,
    sku: {
      name: azurenative.storage.SkuName.Standard_LRS,
    },
    kind: azurenative.storage.Kind.StorageV2,
  },
);

// Function code archives will be stored in this container.
const codeContainer = new azurenative.storage.BlobContainer("blobcontainer", {
  resourceGroupName: resourceGroup.name,
  accountName: storageAccount.name,
});

// Build functions package
// const build = new local.Command("buildCommand", {
//   create: "bun run --filter '*/functions' build2:deploy",
//   triggers: [Date.now().toString()]  // Ensure the command runs every time by using a changing trigger
// });

// Upload Azure Function's code as a zip archive to the storage account.
const codeBlob = new azurenative.storage.Blob("blob", {
  resourceGroupName: resourceGroup.name,
  accountName: storageAccount.name,
  containerName: codeContainer.name,
  source: new pulumi.asset.FileArchive("../packages/functions"),
});
// , { dependsOn: build });

// Remove build folder
// new local.Command("removeCommand", {
//   create: "rm -rf ../packages/functions-build",
//   triggers: [Date.now().toString()]  // Ensure the command runs every time by using a changing trigger
// }, { dependsOn: codeBlob });

// Define a Consumption Plan for the Function App.
// You can change the SKU to Premium or App Service Plan if needed.
const plan = new azurenative.web.AppServicePlan("appserviceplan", {
  resourceGroupName: resourceGroup.name,
  reserved: true,
  sku: {
    name: "Y1",
    tier: "Dynamic",
  },
  kind: 'linux'
});

// Build the connection string and zip archive's SAS URL. They will go to Function App's settings.
const storageConnectionString = getConnectionString(
  resourceGroup.name,
  storageAccount.name,
);
const codeBlobUrl = signedBlobReadUrl(
  codeBlob,
  codeContainer,
  storageAccount,
  resourceGroup,
);

const insights = new azurenative.insights.Component("insightscomponent", {
  applicationType: azurenative.insights.ApplicationType.Web,
  kind: "web",
  resourceGroupName: resourceGroup.name,
  flowType: azurenative.insights.FlowType.Bluefield,
  ingestionMode: azurenative.insights.IngestionMode.ApplicationInsights,
  location: resourceGroup.location,
});

const app = new azurenative.web.WebApp("api", {
  resourceGroupName: resourceGroup.name,
  serverFarmId: plan.id,
  kind: "functionapp,linux",
  siteConfig: {
    appSettings: [
      { name: "AzureWebJobsStorage", value: storageConnectionString },
      { name: "FUNCTIONS_EXTENSION_VERSION", value: "~4" },
      { name: "FUNCTIONS_WORKER_RUNTIME", value: "node" },
      { name: "WEBSITE_NODE_DEFAULT_VERSION", value: "~20" },
      { name: "WEBSITE_RUN_FROM_PACKAGE", value: codeBlobUrl },
      { name: "FUNCTIONS_NODE_BLOCK_ON_ENTRY_POINT_ERROR", value: "true" },
      { name: "SCM_DO_BUILD_DURING_DEPLOYMENT", value: "true" },
      {
        name: "APPINSIGHTS_INSTRUMENTATIONKEY",
        value: insights.instrumentationKey, // conexion key to Application Insights
      },
      { name: "UPDATE_HASH", value: Date.now().toString() },
    ],
    http20Enabled: true,
    nodeVersion: "~20",
    linuxFxVersion: "Node|20",
  },
});

// export const api = pulumi.interpolate`https://${app.defaultHostName}`;
// export const apiEndpoint = app.defaultHostName.apply((ep) => `https://${ep}`);

export const outputs = {
  api: app.defaultHostName.apply((ep) => `https://${ep}`),
}
