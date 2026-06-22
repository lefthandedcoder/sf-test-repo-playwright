import { BrowserContext } from '@playwright/test';
import { getSalesforceToken } from './sfAuth';
import { ENV } from './env';


export async function injectSalesforceSession(context: BrowserContext): Promise<void> {
  const { access_token, instance_url } = await getSalesforceToken();

  const instanceHostname = new URL(instance_url).hostname;

  await context.addCookies([
    {
      name: 'sid',
      value: access_token,
      domain: instanceHostname,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    },
  ]);
}