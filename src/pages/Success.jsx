import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { base44 } from '@/api/base44Client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

function useQueryParams() {
  const { search } = useLocation()
  return React.useMemo(() => new URLSearchParams(search), [search])
}

export default function Success() {
  const params = useQueryParams()
  const sessionId = params.get('session_id')
  const [loading, setLoading] = React.useState(true)
  const [orderId, setOrderId] = React.useState(null)
  const [paid, setPaid] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false

    async function run() {
      if (!sessionId) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch('/api/stripe/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        })

        if (!res.ok) {
          const err = await res.text()
          throw new Error(err || 'Verify failed')
        }

        const data = await res.json()

        if (cancelled) return

        setPaid(Boolean(data.paid))
        setOrderId(data.orderId || null)

        if (data.paid && data.orderId) {
          // Mark order as paid (client-side) so it appears in /admin
          await base44.entities.Order.update(data.orderId, {
            status: 'paid',
            stripe_session_id: sessionId,
            stripe_payment_intent: data.paymentIntent || null,
            paid_at: new Date().toISOString(),
          })
        }

        toast.success('Sikeres fizetés! Köszönjük a rendelésed.')
      } catch (e) {
        console.error(e)
        toast.error('Nem sikerült ellenőrizni a fizetést. Ha levonták az összeget, írj nekünk!')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  }, [sessionId])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <Card className="max-w-xl w-full rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <CheckCircle2 className="w-6 h-6" />
            Fizetés visszaigazolása
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!sessionId ? (
            <p className="text-slate-600">Hiányzik a session_id a URL-ből.</p>
          ) : loading ? (
            <p className="text-slate-600">Ellenőrizzük a fizetést…</p>
          ) : paid ? (
            <>
              <p className="text-slate-700">
                A fizetés sikeres. Hamarosan e-mailben is jelentkezünk a részletekkel.
              </p>
              {orderId && (
                <div className="text-sm text-slate-500">
                  Rendelés azonosító: <span className="font-mono">{orderId}</span>
                </div>
              )}
            </>
          ) : (
            <p className="text-slate-700">
              A fizetés státusza nem <span className="font-semibold">paid</span>. Ha levonták az összeget, írj nekünk.
            </p>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link to="/" className="w-full">
              <Button className="w-full" variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Vissza a főoldalra
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
