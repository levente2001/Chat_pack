import { verifySession } from '../../server/stripeHandlers.js'

export default async function handler(req, res) {
  return verifySession(req, res)
}
