import axios from 'axios';
import { getTenantId } from './keyvault.js';

export async function getTokenFromClientCredentials({ clientId, clientSecret, resourceId, grantType }) {
  const tenantId = await getTenantId();
  const tokenEndpoint = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;

  const response = await axios.post(tokenEndpoint, new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: grantType,
    resource: resourceId
  }));

  return response.data.access_token;
}