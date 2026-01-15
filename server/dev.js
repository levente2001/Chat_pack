import 'dotenv/config'
import express from 'express'
import { createCheckoutSession, verifySession } from './stripeHandlers.js'


const app = express()
app.use(express.json())

app.post('/api/stripe/create-checkout-session', createCheckoutSession)
app.post('/api/stripe/verify-session', verifySession)

const port = process.env.PORT || 4242
app.listen(port, () => {
  console.log(`[stripe-dev-server] listening on http://localhost:${port}`)
})
