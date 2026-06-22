import { test, expect } from '../../fixtures';
import { getSalesforceToken } from '../../utils/sfAuth';
import { ENV } from '../../utils/env';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';

test.describe('Salesforce JWT Authentication', () => {

  test('JWT exchange returns a valid access token and instance URL', async () => {
    // This test validates the auth utility itself — no browser needed
    const token = await getSalesforceToken();

    expect(token.access_token).toBeTruthy();
    expect(token.instance_url).toMatch(/\.salesforce\.com|\.force\.com/);
    expect(token.token_type).toBe('Bearer');
  });

  test('authenticated session lands on Lightning home', async ({ authenticatedPage, page }) => {
    // authenticatedPage fixture handles JWT + cookie injection
    await expect(
      page.getByRole('button', { name: 'App Launcher' })
    ).toBeVisible();

    await expect(page).toHaveURL(/lightning/);
  });

  test('session cookie is present after JWT injection', async ({ authenticatedPage, context }) => {
    const cookies = await context.cookies();
    const sid = cookies.find(c => c.name === 'sid');

    expect(sid).toBeDefined();
    expect(sid?.value).toBeTruthy();
    expect(sid?.secure).toBe(true);
  });

  test('JWT signed with wrong key is rejected by Salesforce', async () => {
    // Generate a throwaway key that Salesforce doesn't recognize
    const wrongKey = `-----BEGIN PRIVATE KEY-----
MIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQCu20qlVT3WP7Zs
Klp3X6GRLDwLUDnUzu6klNs/NPYIZd6NA9vayTmV9h44A4GiQ2nJy5rJLv1wpeLv
6YaBmYOann0Of9ev9/l4i5f6w2SvO7fZ5S2N0+BNNSdYngqQtk9I8zhsVuWFFs18
L/OyrYS5ajCtT8iM6qr8ThHkQ271CrEo3haRa2KWP8pYwo6cC4s3Ez2+zdNHm5CN
Fa+0XdyqmZjNN2CYtDflkjvq+0cVnNkiLu/NWKHmXbKAOoFaBZCbV3eqhpovDPBG
m1nVtPxmZzty5xWbv/569r16hfRS6QoNTaQOIjHxEOi5TCCENjHM8cOYeAAvrSPH
3N82hZdbAgMBAAECgf9qiDgBBt+XSgbarKoZuP4dQX5MXvOp4D2/vx19XanKQNi9
IDZWfG694FLDdgBZSc8xc5HpO31ZzL8QkPTl1Q+xK8iQc1NU1B8xhaCWfxYwl0Bd
paKmdfPTmgPihNxurZ0c6vVCP8xji4hV0OFRRHVIR52MfcZL92uxyQN1WEFB5K0P
xZa72PuSEFovBBnDwcPJlWqnSx+hZjd+rRFvCrwNqQbPwcT10jHAReioJWxnSxJk
xPOWz+GAhtDDMpySmeeS3XI6/CiDuO3NQcBupob2xkyZftKori2SBDJCPrPBx+/m
3q5Ym2/F6PN0uDH2pZkjrT4mFuPY2Ohz0Ik+ePECgYEA4otQsG2GTzwXLqlgiwNF
6u4xXuWudIs5T++sdvUIV+ttowqoEC+P4jf9uI7QYQJBdKze77QpFaPq9rPru4Aq
vSAdXlGaDpNo37WSp5ZJbakaQc4WAfjnpcJ6t6kr9kElpoOb3lQXZ/CrOEzI9FHo
JikH425YrSorHoUuSw6xI7MCgYEAxZeEpAJOHeuw9wFoTODlWWCCGqwQNrf2LPO7
rVX3x8p7XNus+6qrg4pMVlCuisKBiPzRhU00i2pv9iFCh2N4gEitVZduRo5IvFOr
96WZ0NZ093tqzwKHcF3Ac0nB1dSRwplMjdk5JlLJIy9i3zMIeCGQJdsHKBN936yy
rW34ibkCgYBzaBlA52qmbqw4nxyJdK9nkNQhzcvjnxEhQa2QJB+N+mctyb34EOKx
kWh1XnuVD7scnvwrDJJpbcnCx8FtEUu0cOnFJLjgeAPTAwKk0RCzBpRTtZLMimon
rT0q1smId4OgoicDSb9qudXfpm4w2JD0764PFCWkgXjZ4WrF3cQrtQKBgH3FuJR9
MyQwhnBz4OQus05089vuclOiPXzXmDr5YcM2y9eLrUx0ksAkI/s9WBzTOojsBKIJ
Rs0Hb0UIXsS3OFjP6iV1Qqh+oSXfTLNSIdqg58swMAic34FS69F2vX9S04U+90/D
WXFfeNCAtTrFzTpKgurVxHRqE9FwqDtkqLNhAoGBAJUqnoL4Ubyf0h6OGDmPaFqp
ILdphCsUJjgNwXet2qA3Ku0SCmwgAohLBjPdOZHJRRW8VoL7q9dnXWHUBorN9iHf
Jkpll7HxROjsobEdOaLVHKXqBoO3MlnkE/BOV9TcrTHJtoNbB7ivNzihZ2Fpryee
4ZR6avwe3kfij8UgfZa8
-----END PRIVATE KEY-----
`;

    const payload = {
      iss: ENV.consumerKey,
      sub: ENV.username,
      aud: 'https://login.salesforce.com',
      exp: Math.floor(Date.now() / 1000) + 300,
    };

    const badJwt = jwt.sign(payload, wrongKey, { algorithm: 'RS256' });

    const params = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: badJwt,
    });

    const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    expect(response.ok).toBe(false);
    const body = await response.json();
    expect(body.error).toBeTruthy(); // 'invalid_grant' or similar
  });

  test('JWT with expired timestamp is rejected', async () => {
    const privateKey = fs.readFileSync(ENV.privateKeyPath, 'utf8');

    const expiredPayload = {
      iss: ENV.consumerKey,
      sub: ENV.username,
      aud: 'https://login.salesforce.com',
      exp: Math.floor(Date.now() / 1000) - 600, // expired 10 minutes ago
    };

    const expiredJwt = jwt.sign(expiredPayload, privateKey, { algorithm: 'RS256' });

    const params = new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: expiredJwt,
    });

    const response = await fetch('https://login.salesforce.com/services/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    expect(response.ok).toBe(false);
  });
});