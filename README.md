# Acme Notes — sandbox startup for Whydunit

A small, believable SaaS used as the investigation target in the
[Whydunit](https://github.com/Sumit99589/whydunit) demo. **Acme Notes is fictional.** Payments run in
**Stripe test mode** only.

Pages: landing, pricing, signup, onboarding, checkout (Stripe test-mode subscription from a test
PaymentMethod), help/contact (writes to Acme's helpdesk table), and a cookie banner. `/api/health`
reports the deployment, DB and payment mode.

The Whydunit snippet (`public/whydunit.js`) sends funnel events and sampled rrweb recordings through
the first-party proxy at `/api/wd/*`, which adds Vercel's geo header.

## Run locally

```bash
cp .env.example .env.local   # fill in what you have; everything degrades gracefully
psql "$ACME_DATABASE_URL" -f db/schema.sql
pnpm install
pnpm dev
```

Every merge to `main` produces an immutable Vercel deployment; Whydunit's Deploy detective relies on that.

MIT licensed.
