import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';
import { KeyVaultManagementClient } from '@azure/arm-keyvault';
import { SubscriptionClient } from '@azure/arm-subscriptions';
import { execSync } from 'child_process';


export async function getSecretFromKeyVault(vaultUrl, secretName) {
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(vaultUrl, credential);
    try {
        const secret = await client.getSecret(secretName);
        return secret.value;
    } catch (err) {
        console.error("⚠️ Error fetching secret:", err.message);
        return null;
    }
}

export async function listKeyVaults(subscription) {
    const credential = new DefaultAzureCredential();
    const subscriptionId = subscription;

    const kvClient = new KeyVaultManagementClient(credential, subscriptionId);
    const vaults = [];

    for await (const vault of kvClient.vaults.list()) {
        vaults.push({
            name: vault.name,
            value: `https://${vault.name}.vault.azure.net`
        });
    }

    return vaults;
}

export async function listSubscriptions() {
    const credential = new DefaultAzureCredential();
    const client = new SubscriptionClient(credential);

    const subscriptions = [];
    for await (const sub of client.subscriptions.list()) {
        subscriptions.push({
            name: sub.displayName,
            id: sub.subscriptionId
        });
    }

    return subscriptions;
}

export async function listSecretsFromVault(keyVaultUrl) {
    const credential = new DefaultAzureCredential();
    const client = new SecretClient(keyVaultUrl, credential);

    const secretNames = [];

    for await (const secret of client.listPropertiesOfSecrets()) {
        secretNames.push({ name: secret.name, id: secret.name });
    }

    return secretNames;
}

export async function getTenantId() {
    const tenants = [];
    const credential = new DefaultAzureCredential();
    const client = new SubscriptionClient(credential);
    for await (const tenant of client.tenants.list()) {
        tenants.push(tenant);
    }

    if (tenants.length > 0) {
        return tenants[0].tenantId;
    } else {
        console.error("⚠️ Error fetching tenant id:", err.message);
        return null;
    }
}

export function ensureAzLogin() {
    try {
        const result = execSync('az account show', { stdio: 'pipe' }).toString();
        const parsed = JSON.parse(result);
        return !!parsed.user?.name;
    } catch (e) {
        console.error("⚠️ Please login to Azure CLI using `az login` before running this command.");
        process.exit(1);
    }
}