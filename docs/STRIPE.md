# Stripe CLI for Webhooks

This document explains how to use the official Stripe CLI to test and manage webhooks locally during development.

## Overview

The Stripe CLI allows you to:
- Forward Stripe webhook events to your local server.
- Trigger test events from the command line.
- View API logs and errors in real-time.
- Simplify webhook endpoint configuration.

## Installation

### macOS / Linux
```bash
# Using Homebrew
brew install stripe/stripe-cli/stripe

# Or download from GitHub releases
curl -L https://github.com/stripe/stripe-cli/releases/latest/download/stripe-linux-amd64.tar.gz | tar xz
sudo cp stripe /usr/local/bin/
```

### Windows
```powershell
# Using Scoop
scoop install stripe

# Or download the .exe from GitHub releases
```

Verify installation:
```bash
stripe --version
```

## Authentication

Log in to your Stripe account via the CLI:
```bash
stripe login
```

This opens a browser window where you can authorize the CLI. The CLI stores your API key locally (in `~/.config/stripe/config.toml`).

## Listening for Webhook Events

Start forwarding events to your local server:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Replace `localhost:3000/api/webhooks/stripe` with your actual webhook endpoint URL.

When you run this command:
1. Stripe CLI generates a **webhook signing secret** (starting with `whsec_`).
2. It prints the secret in the terminal.
3. Copy this secret to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`.

**Note:** The webhook secret changes each time you run `stripe listen`. Update your `.env.local` accordingly.

## Triggering Test Events

Send test events to your webhook endpoint:
```bash
# List available events
stripe events list

# Trigger a specific event
stripe trigger checkout.session.completed

# Trigger multiple events
stripe trigger payment_intent.succeeded
stripe trigger customer.created
```

The CLI will show the event payload and any response from your endpoint.

## Common Development Workflow

1. Start your local Next.js server:
   ```bash
   npm run dev
   ```

2. In a separate terminal, start Stripe CLI listener:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Copy the printed webhook secret to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. Trigger test events to verify your webhook handler:
   ```bash
   stripe trigger checkout.session.completed
   ```

5. Check your server logs for any errors or console output.

## Project-specific Details

This project already includes a Stripe webhook handler at `apps/webshop/src/app/api/webhooks/stripe/route.ts`. The handler:
- Verifies webhook signatures using `STRIPE_WEBHOOK_SECRET`.
- Handles `checkout.session.completed` events to create orders.
- Extracts shipping and customer information from the session.

To test the webhook flow locally, ensure your `.env.local` contains:
```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # From `stripe listen`
```

## Useful CLI Commands

| Command | Description |
|---------|-------------|
| `stripe login` | Authenticate with your Stripe account |
| `stripe listen --forward-to <url>` | Forward events to local endpoint |
| `stripe trigger <event>` | Trigger a test event |
| `stripe events list` | List available event types |
| `stripe logs tail` | Tail API logs in real-time |
| `stripe samples create` | Create sample projects |

## Troubleshooting

### Webhook Signature Verification Fails

- Ensure you're using the correct webhook secret (`whsec_...`) printed by `stripe listen`.
- The secret changes each time you restart the listener.
- Your endpoint must verify the signature using the raw request body (not parsed JSON).

### Events Not Arriving

- Check that your local server is running on the correct port.
- Verify the `--forward-to` URL matches your webhook route.
- Ensure your firewall isn't blocking the connection.

### Environment Variables

In `apps/webshop/src/app/api/webhooks/stripe/route.ts`, the webhook secret is read from:
```typescript
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
```

Make sure this is set in your `.env.local` file.

## Further Reading

- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
- [Webhook Events](https://stripe.com/docs/api/events)
- [Testing Webhooks](https://stripe.com/docs/webhooks/test)