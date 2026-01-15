import React from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft } from 'lucide-react'

export default function Cancel() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <Card className="max-w-xl w-full rounded-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <XCircle className="w-6 h-6" />
            Fizetés megszakítva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700">
            A fizetést megszakítottad. A rendelésed ettől még megmaradt <span className="font-semibold">Függőben</span> státusszal az adminban.
          </p>
          <Link to="/" className="w-full inline-block">
            <Button className="w-full" variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Vissza a főoldalra
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
