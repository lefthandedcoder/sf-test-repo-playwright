import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import { ENV } from './env';

const SF_LOGIN_URL = 'https://login.salesforce.com';
const JWT_EXPIRY_SECONDS = 3000;

interface SFTokenResponse {
  access_token: string;
  instance_url: string;
  token_type: string;
}
export async function getSalesforceToken(): Promise<SFTokenResponse> {
  const privateKey = fs.readFileSync(ENV.privateKeyPath, 'utf8');

  const payload = {
    iss: ENV.consumerKey,
    sub: ENV.username,
    aud: SF_LOGIN_URL,
    exp: Math.floor(Date.now() / 1000) + JWT_EXPIRY_SECONDS,
  };

  const signedJwt = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

  const params = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: signedJwt,
  });

  const response = await fetch(`${SF_LOGIN_URL}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Salesforce JWT auth failed: ${error}`);
  }

  return response.json() as Promise<SFTokenResponse>;
}