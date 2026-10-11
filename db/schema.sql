-- Acme's own tables. Mirrors the acme schema created by the Whydunit migrations; safe to re-run.
CREATE SCHEMA IF NOT EXISTS acme;

CREATE TABLE IF NOT EXISTS acme.users (
    id          text PRIMARY KEY,
    email       text NOT NULL,
    name        text,
    country     text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    synthetic   boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS acme.payment_attempts (
    id                   text PRIMARY KEY,
    user_id              text,
    created_at           timestamptz NOT NULL DEFAULT now(),
    amount_cents         integer NOT NULL,
    currency             text NOT NULL DEFAULT 'usd',
    provider             text NOT NULL,          -- 'stripe' or 'mock'
    stripe_customer      text,
    stripe_subscription  text,
    stripe_payment_intent text,
    outcome              text NOT NULL,          -- succeeded | declined | error
    decline_code         text,
    card_country         text,
    card_brand           text,
    synthetic            boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS acme_payment_attempts_created ON acme.payment_attempts (created_at);

CREATE TABLE IF NOT EXISTS acme.helpdesk_tickets (
    id          bigserial PRIMARY KEY,
    created_at  timestamptz NOT NULL DEFAULT now(),
    email       text,
    name        text,
    subject     text NOT NULL,
    body        text NOT NULL,
    channel     text NOT NULL DEFAULT 'contact_form',
    meta        jsonb NOT NULL DEFAULT '{}'::jsonb,
    synthetic   boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS acme_helpdesk_created ON acme.helpdesk_tickets (created_at);

CREATE TABLE IF NOT EXISTS acme.reviews (
    id          bigserial PRIMARY KEY,
    created_at  timestamptz NOT NULL DEFAULT now(),
    platform    text NOT NULL,
    rating      integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title       text,
    body        text NOT NULL,
    author      text,
    synthetic   boolean NOT NULL DEFAULT false
);
CREATE INDEX IF NOT EXISTS acme_reviews_created ON acme.reviews (created_at);
