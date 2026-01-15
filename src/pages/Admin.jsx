import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { hu } from 'date-fns/locale';
import {
  Shield,
  ArrowLeft,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Package,
  Eye,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const statusConfig = {
  pending: {
    label: 'Függőben (fizetésre vár)',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Clock
  },
  paid: {
    label: 'Fizetve',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: DollarSign
  },
  confirmed: {
    label: 'Megerősítve',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Package
  },
  shipped: {
    label: 'Szállítás alatt',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Truck
  },
  delivered: {
    label: 'Kiszállítva',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle2
  },
  cancelled: {
    label: 'Törölve',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: XCircle
  }
};


export default function Admin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => base44.entities.Order.list('-created_date'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Order.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Rendelés státusza frissítve');
    },
    onError: () => {
      toast.error('Hiba történt a státusz frissítése során');
    }
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ id: orderId, status: newStatus });
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast.success('Sikeres kijelentkezés');
      navigate('/admin-login', { replace: true });
    } catch (error) {
      toast.error('Nem sikerült kijelentkezni');
    }
  };

  // Stats calculations
  const totalOrders = orders.length;
  const paidOrders = orders.filter((order) => ['paid', 'delivered'].includes(order.status));
  const totalRevenue = paidOrders.reduce((sum, order) => sum + (order.total_price || 0), 0);
  const averageOrder = paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  const stats = [
    {
      title: 'Összes rendelés',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Összes bevétel',
      value: `${totalRevenue.toLocaleString('hu-HU')} Ft`,
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Átlagos rendelés',
      value: `${Math.round(averageOrder).toLocaleString('hu-HU')} Ft`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Függőben lévő',
      value: pendingCount,
      icon: Package,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50'
    }
  ];

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const sortedOrders = [...filteredOrders].sort((a, b) => 
    new Date(b.created_date) - new Date(a.created_date)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Admin Panel</h1>
                <p className="text-sm text-slate-500">Chat Pack rendeléskezelés</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleSignOut}>
                Kijelentkezés
              </Button>
              <Link to="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Vissza a főoldalra
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-rose-500 rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Stats Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden">
                    <CardHeader className={`${stat.bgColor} pb-2`}>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-slate-600">
                          {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                          <stat.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="text-2xl font-bold text-slate-800">
                        {stat.value}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Orders Table */}
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="text-2xl font-bold">Rendelések</CardTitle>
                  <Tabs value={filterStatus} onValueChange={setFilterStatus}>
                    <TabsList>
                      <TabsTrigger className="cursor-pointer" value="all">Összes</TabsTrigger>
                      <TabsTrigger className="cursor-pointer" value="pending">Függőben</TabsTrigger>
                      <TabsTrigger className="cursor-pointer" value="paid">Fizetve</TabsTrigger>
                      <TabsTrigger className="cursor-pointer" value="confirmed">Megerősítve</TabsTrigger>
                      <TabsTrigger className="cursor-pointer" value="shipped">Szállítás alatt</TabsTrigger>
                      <TabsTrigger className="cursor-pointer" value="delivered">Kiszállítva</TabsTrigger>
                      <TabsTrigger className="cursor-pointer" value="cancelled">Törölve</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                {sortedOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500">Nincs megjeleníthető rendelés</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Azonosító</TableHead>
                          <TableHead>Vásárló</TableHead>
                          <TableHead>Dátum</TableHead>
                          <TableHead>Mennyiség</TableHead>
                          <TableHead>Összeg</TableHead>
                          <TableHead>Státusz</TableHead>
                          <TableHead className="text-right">Műveletek</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedOrders.map((order, index) => {
                          const StatusIcon = statusConfig[order.status]?.icon || Clock;
                          return (
                            <motion.tr
                              key={order.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              className="hover:bg-slate-50"
                            >
                              <TableCell className="font-mono text-sm">
                                #{order.id.slice(0, 8)}
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="font-medium">{order.customer_name}</div>
                                  <div className="text-sm text-slate-500">{order.customer_email}</div>
                                </div>
                              </TableCell>
                              <TableCell className="text-sm text-slate-600">
                                {format(new Date(order.created_date), 'yyyy. MMM d. HH:mm', { locale: hu })}
                              </TableCell>
                              <TableCell>
                                <span className="font-medium">{order.quantity} db</span>
                              </TableCell>
                              <TableCell className="font-semibold">
                                {order.total_price?.toLocaleString('hu-HU')} Ft
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col gap-2">
                                  <Badge variant="outline" className={`${statusConfig[order.status]?.color} w-fit`}>
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusConfig[order.status]?.label}
                                  </Badge>
                                  <Select
                                    value={order.status}
                                    onValueChange={(value) => handleStatusChange(order.id, value)}
                                  >
                                    <SelectTrigger className="h-8 text-xs w-[140px] bg-white cursor-pointer">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="border-slate-200 bg-white shadow-lg cursor-pointer">
                                      <SelectItem className="cursor-pointer" value="pending">Függőben</SelectItem>
                                      <SelectItem className="cursor-pointer" value="paid">Fizetve</SelectItem>
                                      <SelectItem className="cursor-pointer" value="confirmed">Megerősítve</SelectItem>
                                      <SelectItem className="cursor-pointer" value="shipped">Szállítás alatt</SelectItem>
                                      <SelectItem className="cursor-pointer" value="delivered">Kiszállítva</SelectItem>
                                      <SelectItem className="cursor-pointer" value="cancelled">Törölve</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleViewDetails(order)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Részletek
                                </Button>
                              </TableCell>
                            </motion.tr>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Order Details Dialog */}
      {selectedOrder && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center justify-between">
                <span>Rendelés részletei</span>
                <Badge className={statusConfig[selectedOrder.status]?.color}>
                  {statusConfig[selectedOrder.status]?.label}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Package className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Rendelésszám</p>
                    <p className="font-mono font-semibold">#{selectedOrder.id.slice(0, 12)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Dátum</p>
                    <p className="font-semibold">
                      {format(new Date(selectedOrder.created_date), 'yyyy. MMMM d. HH:mm', { locale: hu })}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Vásárló adatai</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">
                        {selectedOrder.customer_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{selectedOrder.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
                    <a href={`mailto:${selectedOrder.customer_email}`} className="text-blue-600 hover:underline">
                      {selectedOrder.customer_email}
                    </a>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                    <a href={`tel:${selectedOrder.customer_phone}`} className="text-blue-600 hover:underline">
                      {selectedOrder.customer_phone}
                    </a>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Shipping Address */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Szállítási cím</h3>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-slate-400 mt-1" />
                  <div className="text-slate-700">
                    <p>{selectedOrder.shipping_address || selectedOrder.gls_parcelshop_name}</p>
                    <p>{selectedOrder.shipping_zip} {selectedOrder.shipping_city || selectedOrder.gls_parcelshop_address}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Megrendelt termék</h3>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Chat Pack - 35 kérdés</span>
                    <span className="text-slate-600">{selectedOrder.quantity} db</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600">Termék ár:</span>
                    <span className="font-medium">{((selectedOrder.total_price - 990) || 0).toLocaleString('hu-HU')} Ft</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-slate-600">Szállítási díj:</span>
                    <span className="font-medium">990 Ft</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Összesen:</span>
                    <span className="font-bold text-xl text-rose-600">
                      {selectedOrder.total_price?.toLocaleString('hu-HU')} Ft
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5" />
                      Megjegyzés
                    </h3>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <p className="text-slate-700">{selectedOrder.notes}</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
