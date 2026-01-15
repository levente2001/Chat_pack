import Stripe from 'stripe'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('Missing STRIPE_SECRET_KEY env var')
  }
  return new Stripe(key, {
    // No need to pin apiVersion here; Stripe will default to your account version.
    // You can pin later if you want deterministic behavior.
  })
}

function getOrigin(req) {
  // Prefer Origin header; fall back to Host
  const origin = req.headers?.origin
  if (origin) return origin
  const proto = req.headers?.['x-forwarded-proto'] || 'https'
  const host = req.headers?.host
  return host ? `${proto}://${host}` : 'http://localhost:5173'
}

function envInt(name, fallback) {
  const raw = process.env[name]
  if (!raw) return fallback

  // Kezeli: "3990", "7 900", "7,900", "7.900" -> 3990
  const cleaned = String(raw).trim().replace(/[^\d-]/g, '')
  const n = Number.parseInt(cleaned, 10)
  return Number.isFinite(n) ? n : fallback
}

const PRODUCT_NAME = process.env.PRODUCT_NAME || 'Chat Pack'
const CURRENCY = (process.env.CURRENCY || 'huf').toLowerCase()
const UNIT_PRICE = envInt('UNIT_PRICE', 3990) // Ft
const SHIPPING_PRICE = envInt('SHIPPING_PRICE', 990) // Ft

function readJsonBody(req) {
  // Vercel functions sometimes give an already-parsed body; express gives object
  if (req.body && typeof req.body === 'object') return req.body
  if (!req.body) return null
  try {
    return JSON.parse(req.body)
  } catch {
    return null
  }
}

export async function createCheckoutSession(req, res) {
  try {
    const body = readJsonBody(req) || {}

    // ✅ quantity legyen mindig egész szám 1..10
    const qRaw = Number(body.quantity)
    const quantity = Number.isFinite(qRaw)
      ? Math.max(1, Math.min(10, Math.trunc(qRaw)))
      : 1

    const orderId = String(body.orderId || '').trim()
    const customerEmail = body.customerEmail ? String(body.customerEmail).trim() : undefined

    if (!orderId) return res.status(400).json({ error: 'Missing orderId' })

    const stripe = getStripe()
    const origin = getOrigin(req)

    // ✅ currency trim + lower
    const currency = String(CURRENCY || 'huf').trim().toLowerCase()

    // ✅ árak legyenek biztos integer-ek
    // (ha valami env véletlenül túl kicsi, legalább ne Stripe-nál haljon el)
    const toMinor = (amountMajor) => Math.round(Number(amountMajor || 0) * 100);
    const unitPrice = Math.max(0, toMinor(UNIT_PRICE));
    const shippingPrice = Math.max(0, toMinor(SHIPPING_PRICE));

    const total = unitPrice * quantity + shippingPrice
    const minTotal = currency === 'huf' ? 175 : 0

    if (!Number.isFinite(total)) {
      return res.status(400).json({ error: `Invalid total. unit=${unitPrice}, ship=${shippingPrice}, qty=${quantity}` })
    }
    if (total < minTotal) {
      return res.status(400).json({
        error: `Összeg túl alacsony (${total} ${currency}). Minimum: ${minTotal} ${currency}. (unit=${unitPrice}, ship=${shippingPrice}, qty=${quantity})`,
      })
    }

    // (hasznos debug – ha mégis baj van, ebből azonnal látod)
    console.log('[stripe]', { currency, unitPrice, shippingPrice, quantity, total })


    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: PRODUCT_NAME },
            unit_amount: unitPrice,
          },
          quantity,
        },
        {
          price_data: {
            currency,
            product_data: { name: 'Szállítás' },
            unit_amount: shippingPrice,
          },
          quantity: 1,
        },
      ],
      metadata: { orderId },
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    })

    return res.status(200).json({ url: session.url, sessionId: session.id })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e?.message || 'Server error' })
  }
}


export async function verifySession(req, res) {
  try {
    const body = readJsonBody(req) || {}
    const sessionId = String(body.sessionId || '').trim()

    if (!sessionId) {
      return res.status(400).json({ error: 'Missing sessionId' })
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    const paid = session.payment_status === 'paid'
    const orderId = session.metadata?.orderId || null

    return res.status(200).json({
      paid,
      orderId,
      paymentIntent: session.payment_intent || null,
      amountTotal: session.amount_total || null,
      currency: session.currency || null,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: e.message || 'Server error' })
  }
}
