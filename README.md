# Salesforce Playwright Test Suite

Playwright + TypeScript test automation against a Salesforce Developer Edition org,
covering JWT bearer authentication, contact CRUD, and Lightning navigation.

Standard Salesforce login is a problem for automation because MFA blocks headless browsers
and storing passwords in CI is just a bad practice. This project uses the OAuth 2.0 JWT
bearer flow instead: an External App trusts a signed RSA certificate, exchanges it
for an access token at runtime, and hands it to Playwright via `frontdoor.jsp`. No
password, no MFA prompt, no interactive login. This is how production Salesforce
automation pipelines actually work, and it's a deliberate choice over the easier
username/password path.

The test suite demonstrates a few things that make Salesforce automation genuinely
different from standard web automation: ARIA role selectors for Lightning web
components (which don't behave like normal inputs), hover-to-reveal inline edit
patterns, `records-record-layout-item` as a stable DOM anchor for field-level
interactions, and `domcontentloaded` + UI element presence as a more reliable
readiness signal than Playwright's built-in load states.

## Setup

Clone the repo, run `npm install`, then copy `.env.example` to `.env` and fill in
your org URL, username, Consumer Key, and path to your RSA private key. You'll need
a Salesforce Developer Edition org (free at developer.salesforce.com) with a
Connected App or External App configured for JWT bearer flow. Full setup steps are in `.env.example`.

```
npm test                        # full suite
npx playwright test --headed    # watch the browser
npx playwright show-report      # open the HTML report
```
