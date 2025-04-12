# 🔐 CredKit – Azure Secret-based Token Generator CLI

**CredKit** is a developer-friendly CLI tool that helps teams securely manage and generate tokens for multiple applications using secrets stored in **Azure Key Vault**. No need to share client secrets separately – CredKit uses azure default credentials and securely reads secrets via Azure SDK.

---

## 📦 Features

- 🔑 Generate tokens for multiple applications securely
- 📥 Import token config from a JSON file
- 🔐 Highly secure since no secret is stored locally and config files can be shared

---

## 🚀 Installation

```bash
npm install -g credkit
```

NOTE : Ensure you run *az login* before proceeding to use the application since it is dependent on that.

## Add New Token config
Developers can add new token configuration using the following comment.
```bash
~ credkit add
```
Guided setup to add a new token generation scope which looks like following
```bash
? What would you like to call the name of token generation scope? → myapp-dev-token
? What's the client ID? → 1234-5678-abcd
? Where's the secret located? → [select Key Vault]
? Select secret name from Key Vault → [select secret]
? What's the resource ID? → api://xyz
✅ Added new token config!
```

## Add Multiple Token configs
Developers can also draft a configuration file of the following format to bulk import configs and then run the command.

*Note : Ensure the values added are valid since these are manually added by you.*

### 📁 Configuration File Structure
config.json
```bash
[
  {
    "keyvault-name": "https://my-keyvault.vault.azure.net",
    "client-id": "my-client-id",
    "keyvault-client-secret-name": "keyvault-secret-name",
    "grant-type": "client_credentials",
    "resource-id": "api://my-resource-id",
    "display-name": "myapp-dev-token"
  }
]
```

```bash
~ credkit import config.json
```

## Generate Token
Once a new token config has been added or imported, developers can generate token for the config by running the following command

```bash
~ credkit token
```

## Clear all configs
If the developer wants to clear all the token generation configuration. Use the following command.

```bash
~ credkit clear
```
