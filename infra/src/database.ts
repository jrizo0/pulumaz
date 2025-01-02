import * as pulumi from "@pulumi/pulumi";
import * as azure from "@pulumi/azure-native";
import * as random from "@pulumi/random";

const password = new random.RandomPassword("DBPassword", {
  // NB must be between 8-128.
  length: 16,
  minLower: 1,
  minUpper: 1,
  minNumeric: 1,
  minSpecial: 1,
});

const rgroup = new azure.resources.ResourceGroup("rgdatabase", {
  location: "eastus2",
});

export const database = new azure.dbforpostgresql.Server("database", {
  resourceGroupName: rgroup.name,
  location: rgroup.location,
  availabilityZone: "1",
  version: "16",
  administratorLogin: "postgres",
  administratorLoginPassword: password.result,
  backup: {
    backupRetentionDays: 7,
  },
  // see az postgres flexible-server list-skus --location northeurope
  // see https://learn.microsoft.com/en-us/azure/templates/microsoft.dbforpostgresql/2022-12-01/flexibleservers#sku
  // see https://azure.microsoft.com/en-us/pricing/details/postgresql/flexible-server/
  sku: {
    // tier: "GeneralPurpose",
    // name: "Standard_D2ds_v4", // 2 vCore. 8 GiB RAM.
    tier: "Burstable",
    name: "Standard_B1ms", // 1 vCore. 2 GiB RAM.
  },
  storage: {
    // storageSizeGB: 32,
    storageSizeGB: 32,
  },
});

new azure.dbforpostgresql.FirewallRule("all", {
  resourceGroupName: rgroup.name,
  serverName: database.name,
  startIpAddress: "0.0.0.0",
  endIpAddress: "255.255.255.255",
});

const db_host = database.fullyQualifiedDomainName;
const db_password = password.result;
const db_user = database.administratorLogin;

export const dbConnection = pulumi.interpolate`postgres://${db_user}:${db_password}@${db_host}`;

export const outputs = {
  db_host,
  db_password,
  db_connection: dbConnection,
};
