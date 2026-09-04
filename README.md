# RefinedBadger Website

Official public website repository for **RefinedBadger Studios LLC**.

- Production domain: https://refinedbadger.com
- Hosting target: Cloudflare Workers Static Assets
- Source control: GitHub
- Public contact: hello@refinedbadger.com

## Important security boundary

This repository is intended to be safe to keep public.

Do **not** add:
- EIN or IRS letters
- SSNs
- home/physical operating address
- bank records
- signed operating agreement
- government IDs
- API keys/tokens
- private grant/application records
- private game source code

## Local preview

`powershell
npm install
npm run dev
`

## Cloudflare deployment

The project uses wrangler.jsonc with Workers Static Assets.

Manual deploy:

`powershell
npm install
npx wrangler login
npx wrangler whoami
npm run deploy
`

Recommended production flow after the first deploy:
Cloudflare Dashboard -> Workers & Pages -> Import a repository -> connect this GitHub repo.

Then connect the custom domains:
- refinedbadger.com
- www.refinedbadger.com

## Editing content

The public site is intentionally lightweight. The main files are:

- public/index.html
- public/styles.css
- public/assets/favicon.svg
- public/404.html

Replace the temporary RB favicon/logo mark when the final RefinedBadger logo is selected.