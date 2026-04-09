# Stonehorn Stripe Setup

## 1) Add environment variables

Create `.env` from template:

```bash
cd /Users/mckaywclark/Desktop/Stonehorn
cp .env.example .env
```

Set real Stripe values in `.env`, then run:

```bash
cd /Users/mckaywclark/Desktop/Stonehorn
npm start
```

## 2) Create webhook in Stripe

In Stripe Dashboard (test mode):

1. Go to `Developers -> Webhooks`
2. Add endpoint: `http://127.0.0.1:5500/api/stripe/webhook`
3. Listen to event:
   - `checkout.session.completed`
4. Copy signing secret into `STRIPE_WEBHOOK_SECRET`

## 3) Test checkout

1. Open `http://127.0.0.1:5500`
2. Click any hat `Buy Now`
3. On checkout page, click `Continue To Payment`
4. Pay in Stripe test mode with card:
   - `4242 4242 4242 4242`
   - any future date / any CVC / any ZIP

## 4) Payment flow now

- `checkout.html` starts Stripe Checkout via backend.
- Stripe collects card + shipping address securely.
- On success, user returns to `success.html`.
- Server confirms payment status via Stripe session and webhook.

## 5) Optional: order confirmation emails

To send automatic order emails, set in `.env`:

```env
RESEND_API_KEY=re_your_resend_key
ORDER_EMAIL_FROM=Stonehorn <orders@yourdomain.com>
ORDER_EMAIL_REPLY_TO=support@yourdomain.com
```

Then restart server:

```bash
cd /Users/mckaywclark/Desktop/Stonehorn
npm start
```

Admin orders dashboard:

- `http://127.0.0.1:5500/admin-orders.html`
