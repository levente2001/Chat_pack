import { createCheckoutSession } from '../../server/stripeHandlers.js'

export default async function handler(req, res) {
  return createCheckoutSession(req, res)
}
