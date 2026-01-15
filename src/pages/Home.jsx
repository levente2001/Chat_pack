import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import {
  Menu, X, ShoppingBag, MessageCircle, ChevronDown, Sparkles, Heart, Users, Coffee, Gift,
  TrendingUp, Minus, Plus, Check, Truck, Shield, HelpCircle, ChevronLeft, ChevronRight,
  Star, Quote, Send, Calendar as CalendarIcon, Package
} from 'lucide-react';
import GlsParcelShopPicker from "../components/GlsParcelShopPicker";


const PRICE = 3990;
const SHIPPING = 990;

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <Features />
      <Gallery />
      <PurchaseCard />
      <FAQ />
      <Reviews />
      <Footer />
    </div>
  );
}

// Navbar Component
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Előnyök', id: 'features' },
    { label: 'Galéria', id: 'gallery' },
    { label: 'GYIK', id: 'faq' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                isScrolled ? 'bg-gradient-to-br from-rose-500 to-amber-500' : 'bg-white/90'
              }`}>
                <MessageCircle className={`w-5 h-5 ${isScrolled ? 'text-white' : 'text-rose-500'}`} />
              </div>
              <span className="font-bold text-xl text-slate-800">Chat Pack</span>
            </button>

            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-colors ${
                    isScrolled ? 'text-slate-600 hover:text-rose-500 cursor-pointer' : 'text-slate-700 hover:text-rose-500 cursor-pointer'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <motion.button
                onClick={() => scrollToSection('product')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 hover:shadow-xl transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Megrendelem
              </motion.button>
            </div>

            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2">
              {isMobileMenuOpen ? <X className="w-6 h-6 text-slate-800" /> : <Menu className="w-6 h-6 text-slate-800" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-16 z-40 bg-white shadow-xl lg:hidden"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 text-slate-700 font-medium hover:bg-slate-50 rounded-xl transition-colors"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('product')}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Megrendelem – 3 990 Ft
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Hero Section Component
function HeroSection() {
  const scrollToProduct = () => {
    document.getElementById('product')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-rose-50">
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-rose-100/20 to-amber-100/20 rounded-full blur-3xl" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 lg:pt-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-rose-100 mb-6"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-600">35 gondolatébresztő kérdés</span>
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
              <span className="block">Beszélgessetek</span>
              <span className="block bg-gradient-to-r from-rose-500 to-amber-500 bg-clip-text text-transparent">
                igazán
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              Fedezd fel azokat a kérdéseket, amelyek mélyebb beszélgetésekhez vezetnek – 
              akár a pároddal, barátaiddal, családoddal vagy kollégáiddal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button
                onClick={scrollToProduct}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-2xl shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-300 cursor-pointer"
              >
                Megrendelem – 3 990 Ft
              </motion.button>
              <motion.a
                href="#features"
                whileHover={{ scale: 1.02 }}
                className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-2xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50/50 transition-all duration-300 text-center"
              >
                Tudj meg többet
              </motion.a>
            </div>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-10 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Raktáron</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Gyors szállítás</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Ajándéknak tökéletes</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-200 via-amber-200 to-rose-200 rounded-3xl opacity-50 blur-xl" />
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
                <img
                  src="https://happycards.hu/uploads/happycards-1658422776_2.jpeg"
                  alt="Chat Pack kártyák"
                  className="w-full h-auto object-cover"
                />
              </div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="
                  absolute left-1/2 -translate-x-1/2 -bottom-6
                  w-[80%]
                  md:w-auto md:-left-6 md:-bottom-6 md:translate-x-0
                  bg-white rounded-2xl shadow-xl p-4 border border-slate-100
                "
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-linear-to-br from-rose-100 to-amber-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💬</span>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">35 kérdés</p>
                    <p className="text-sm text-slate-500">mélyebb beszélgetésekhez</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:block"
        >
          <motion.button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="p-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// Features Component
function Features() {
  const features = [
    {
      icon: Users,
      title: 'Mindenkinek',
      description: 'Pároknak, barátoknak, családnak vagy akár munkatársaknak – bárkivel mélyebb kapcsolatot építhetsz.',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      icon: MessageCircle,
      title: '35 egyedi kérdés',
      description: 'Gondosan összeválogatott kérdések, amelyek garantáltan érdekes beszélgetésekhez vezetnek.',
      color: 'from-rose-500 to-pink-500',
      bgColor: 'bg-rose-50'
    },
    {
      icon: Coffee,
      title: 'Bármikor, bárhol',
      description: 'Vacsoránál, utazás közben, vagy egy kávé mellett – tökéletes minden alkalomra.',
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50'
    },
    {
      icon: Heart,
      title: 'Mélyebb kapcsolatok',
      description: 'Ismerd meg jobban azokat, akik fontosak számodra – új oldalukról lásd őket.',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Gift,
      title: 'Tökéletes ajándék',
      description: 'Különleges, személyes ajándék születésnapra, évfordulóra vagy bármilyen alkalomra.',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      icon: Sparkles,
      title: 'Prémium minőség',
      description: 'Gyönyörű dizájn, tartós kivitelezés – öröm kézbe venni és használni.',
      color: 'from-slate-600 to-slate-800',
      bgColor: 'bg-slate-50'
    }
  ];

  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-rose-500 font-semibold text-sm tracking-wider uppercase mb-4 block">
            Miért válaszd a Chat Pack-et?
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
            Több mint egy kártyacsomag
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A tartalmas beszélgetések kulcsa a jó kérdésekben rejlik. 
            Mi összegyűjtöttük neked a legjobbakat.
          </p>
        </motion.div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className={`${feature.bgColor} rounded-3xl p-8 h-full border border-transparent hover:border-slate-200 hover:shadow-xl transition-all duration-300`}>
                <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Gallery Component
function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { url: 'https://happycards.hu/uploads/happycards-1658422776_2.jpeg', alt: 'Chat Pack kártyák összkép' },
    { url: 'https://happycards.hu/uploads/happycards-1599642588_1.jpg', alt: 'Chat Pack kártya közeli' },
    { url: 'https://happycards.hu/uploads/happycards-1599642589_2.jpg', alt: 'Chat Pack kártyák használat közben' },
    { url: 'https://happycards.hu/uploads/happycards-1658422774_1.jpg', alt: 'Chat Pack csomag' }
  ];

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  return (
    <section id="gallery" className="py-24 bg-linear-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-rose-500 font-semibold text-sm tracking-wider uppercase mb-4 block">
            Galéria
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Nézd meg közelebbről
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {images.map((image, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => openLightbox(index)}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-left">
                Kattints a nagyításhoz
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            
            <button
              onClick={prevImage}
              className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>
            
            <motion.img
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            
            <button
              onClick={nextImage}
              className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-10 h-10" />
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Purchase Card Component
function PurchaseCard() {
  const [quantity, setQuantity] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const DEFAULT_FORM = {
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    shipping_address: '',
    shipping_city: '',
    shipping_zip: '',
    notes: '',

    // NEW
    payment_method: 'card', // 'card' | 'cod'
    shipping_method: 'gls_home', // 'gls_home' | 'gls_parcelshop'
    gls_parcelshop_id: '',
    gls_parcelshop_name: '',
    gls_parcelshop_address: '',
  };

  const [formData, setFormData] = useState(DEFAULT_FORM);

  const totalPrice = PRICE * quantity;
  const finalPrice = totalPrice + SHIPPING;

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openGlsParcelShopFinder = () => {
    // GLS hivatalos csomagpont-kereső (a kiválasztott pont adatait a user bemásolhatja)
    window.open('https://gls-group.com/HU/hu/gls-csomagpontok/', '_blank', 'noopener,noreferrer');
  };

  const resetAfterCod = () => {
    setFormData(DEFAULT_FORM);
    setQuantity(1);
    setIsDialogOpen(false);
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.shipping_method === 'gls_parcelshop' && !formData.gls_parcelshop_id) {
      toast.error('Kérlek válassz egy GLS CsomagPontot!');
      setIsSubmitting(false);
      return;
    }


    try {
      // 1) Create order in Firebase (so it appears in /admin immediately)
      const order = await base44.entities.Order.create({
        ...formData,
        quantity,
        total_price: finalPrice,
        shipping_cost: SHIPPING,
        status: 'pending', // pending payment or pending delivery (COD)
      });

      // 2) If CASH ON DELIVERY -> do NOT go to Stripe
      if (formData.payment_method === 'cod') {
        toast.success('Rendelés rögzítve! Fizetés utánvéttel a kézbesítéskor.');
        resetAfterCod();
        return;
      }

      // 3) CARD -> Stripe Checkout Session
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          quantity,
          customerEmail: formData.customer_email,
        }),
      });

      if (!res.ok) {
        let msg = 'Failed to create Stripe session'
        try {
          const j = await res.json()
          msg = j?.error || msg
        } catch {
          msg = (await res.text()) || msg
        }
        throw new Error(msg)
      }

      const { url, sessionId } = await res.json()


      // 4) Save session id on the order (optional but useful)
      await base44.entities.Order.update(order.id, {
        stripe_session_id: sessionId,
      });

      // 5) Redirect to Stripe-hosted checkout
      window.location.href = url;
    } catch (error) {
      console.error(error);

      const msg = String(error?.message || "");
      if (msg.includes("ERR_BLOCKED_BY_CLIENT") || msg.includes("blocked")) {
        toast.error("A böngésződ blokkolja a Firestore kapcsolatot (adblock/privacy). Kapcsold ki erre az oldalra és próbáld újra.");
      } else {
        toast.error("Nem sikerült leadni a rendelést. Kérlek próbáld újra.");
      }

      setIsSubmitting(false);
    }

  };

  return (
    <section id="product" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="sticky top-24"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-rose-200 to-amber-200 rounded-3xl opacity-30 blur-2xl" />
              <img
                src="https://happycards.hu/uploads/happycards-1658422776_2.jpeg"
                alt="Chat Pack"
                className="relative rounded-3xl shadow-2xl w-full"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-slate-100">
              <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Raktáron
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2">Chat Pack</h2>
              <p className="text-lg text-slate-500 mb-6">35 kérdés egy jó beszélgetéshez</p>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-bold text-slate-800">
                  {PRICE.toLocaleString('hu-HU')} Ft
                </span>
                <span className="text-slate-400 line-through">9.900 Ft</span>
                <span className="bg-rose-100 text-rose-600 text-sm font-semibold px-2 py-1 rounded-lg">-20%</span>
              </div>

              <div className="mb-8">
                <label className="text-sm font-medium text-slate-600 mb-3 block">Mennyiség</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-slate-100 rounded-xl">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-3 hover:bg-slate-200 rounded-l-xl transition-colors cursor-pointer"
                      disabled={quantity <= 1}
                      type="button"
                    >
                      <Minus className="w-5 h-5 text-slate-600" />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-3 hover:bg-slate-200 rounded-r-xl transition-colors cursor-pointer"
                      disabled={quantity >= 10}
                      type="button"
                    >
                      <Plus className="w-5 h-5 text-slate-600" />
                    </button>
                  </div>
                  <span className="text-slate-500">
                    Összesen:{' '}
                    <span className="font-semibold text-slate-800">
                      {totalPrice.toLocaleString('hu-HU')} Ft
                    </span>
                  </span>
                </div>
              </div>

              <motion.button
                onClick={() => setIsDialogOpen(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold text-lg rounded-2xl shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
                type="button"
              >
                <ShoppingBag className="w-5 h-5" />
                Megrendelem
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setIsSubmitting(false);
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">Rendelés leadása</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Summary */}
            <div className="bg-slate-50 rounded-xl p-4 mb-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">Chat Pack × {quantity}</span>
                <span className="font-medium">{totalPrice.toLocaleString('hu-HU')} Ft</span>
              </div>

              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-600">
                  Szállítás ({formData.shipping_method === 'gls_home' ? 'GLS házhozszállítás' : 'GLS CsomagPont'})
                </span>
                <span className="font-medium">{SHIPPING.toLocaleString('hu-HU')} Ft</span>
              </div>

              <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between items-center">
                <span className="font-semibold text-slate-800">Összesen</span>
                <span className="font-bold text-xl text-rose-600">{finalPrice.toLocaleString('hu-HU')} Ft</span>
              </div>
            </div>

            {/* Payment method */}
            <div className="space-y-2">
              <Label>Fizetési mód *</Label>

              <label
                className={`flex items-center justify-between gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                  formData.payment_method === 'card'
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="card"
                    checked={formData.payment_method === 'card'}
                    onChange={handleInputChange}
                  />
                  <div>
                    <div className="font-medium text-slate-800">Bankkártya (Stripe)</div>
                    <div className="text-xs text-slate-500">Azonnali online fizetés</div>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center justify-between gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                  formData.payment_method === 'cod'
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={formData.payment_method === 'cod'}
                    onChange={handleInputChange}
                  />
                  <div>
                    <div className="font-medium text-slate-800">Utánvét</div>
                    <div className="text-xs text-slate-500">Fizetés átvételkor</div>
                  </div>
                </div>
              </label>
            </div>

            {/* Shipping method */}
            <div className="space-y-2">
              <Label>Szállítási mód *</Label>

              <label
                className={`flex items-center justify-between gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                  formData.shipping_method === 'gls_home'
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping_method"
                    value="gls_home"
                    checked={formData.shipping_method === 'gls_home'}
                    onChange={handleInputChange}
                  />
                  <div>
                    <div className="font-medium text-slate-800">GLS házhozszállítás</div>
                    <div className="text-xs text-slate-500">Kézbesítés a megadott címre</div>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center justify-between gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                  formData.shipping_method === 'gls_parcelshop'
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping_method"
                    value="gls_parcelshop"
                    checked={formData.shipping_method === 'gls_parcelshop'}
                    onChange={handleInputChange}
                  />
                  <div>
                    <div className="font-medium text-slate-800">GLS CsomagPont</div>
                    <div className="text-xs text-slate-500">Átvétel választott csomagponton</div>
                  </div>
                </div>
              </label>
            </div>

            {/* Customer */}
            <div>
              <Label htmlFor="customer_name">Teljes név *</Label>
              <Input
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_email">Email *</Label>
                <Input
                  id="customer_email"
                  name="customer_email"
                  type="email"
                  value={formData.customer_email}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="customer_phone">Telefonszám *</Label>
                <Input
                  id="customer_phone"
                  name="customer_phone"
                  type="tel"
                  value={formData.customer_phone}
                  onChange={handleInputChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            {/* Shipping details */}
            {formData.shipping_method === 'gls_home' ? (
              <>
                <div>
                  <Label htmlFor="shipping_address">Szállítási cím *</Label>
                  <Input
                    id="shipping_address"
                    name="shipping_address"
                    value={formData.shipping_address}
                    onChange={handleInputChange}
                    placeholder="Utca, házszám"
                    required
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipping_city">Város *</Label>
                    <Input
                      id="shipping_city"
                      name="shipping_city"
                      value={formData.shipping_city}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="shipping_zip">Irányítószám *</Label>
                    <Input
                      id="shipping_zip"
                      name="shipping_zip"
                      value={formData.shipping_zip}
                      onChange={handleInputChange}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
              </>
            ) : (
              <GlsParcelShopPicker
                selected={{
                  id: formData.gls_parcelshop_id,
                  name: formData.gls_parcelshop_name,
                  address: formData.gls_parcelshop_address,
                }}
                onSelect={(dp) => {
                  setFormData((prev) => ({
                    ...prev,
                    gls_parcelshop_id: dp.id,
                    gls_parcelshop_name: dp.name,
                    gls_parcelshop_address: dp.address,
                  }));
                }}
              />
            )}

            <div>
              <Label htmlFor="notes">Megjegyzés (opcionális)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Ajándékcsomagolás kérése, egyéb megjegyzés..."
                className="mt-1"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-lg rounded-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Feldolgozás...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5" />
                  {formData.payment_method === 'card' ? 'Fizetés bankkártyával' : 'Rendelés leadása (utánvét)'}
                </span>
              )}
            </Button>

            <p className="text-xs text-slate-500 text-center">
              A rendelés leadásával elfogadod az általános szerződési feltételeket.
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

// FAQ Component
function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Kinek való a Chat Pack?',
      answer: 'A Chat Pack mindenkinek szól, aki szeretne mélyebb, tartalmasabb beszélgetéseket folytatni. Tökéletes pároknak, barátoknak, családtagoknak, sőt akár munkatársaknak is. A kérdések univerzálisak, így bármilyen kapcsolatban használhatóak.'
    },
    {
      question: 'Hány kérdés van a csomagban?',
      answer: 'A Chat Pack 35 gondosan összeválogatott kérdést tartalmaz, amelyek különböző témákat ölelnek fel: múlt, jelen, jövő, vágyak, vélemények és szórakoztató szituációk.'
    },
    {
      question: 'Hogyan kell használni?',
      answer: 'Nagyon egyszerű! Húzzatok egy kártyát, olvassátok fel a kérdést és válaszoljatok rá felváltva. Nincs jó vagy rossz válasz – a lényeg az őszinte, nyitott beszélgetés. Használhatjátok vacsoránál, utazás közben, vagy bármikor, amikor időtöltésre vágytok.'
    },
    {
      question: 'Milyen gyorsan érkezik meg a rendelés?',
      answer: 'A megrendeléseket általában 1-2 munkanapon belül postázzuk, és a szállítás további 1-2 munkanapot vesz igénybe. Összesen tehát 2-4 munkanapon belül megkapod a csomagodat.'
    },
    {
      question: 'Hogyan fizethetek?',
      answer: 'Jelenleg utánvéttel (a futárnál készpénzzel vagy kártyával) vagy előreutalással fizethetsz. A rendelés leadása után emailben küldjük az utalási adatokat.'
    },
    {
      question: 'Kérhetek ajándékcsomagolást?',
      answer: 'Igen, természetesen! A rendelés leadásakor a megjegyzés rovatban jelezd, hogy ajándékcsomagolást kérsz, és díjmentesen elkészítjük neked.'
    },
    {
      question: 'Mi van, ha nem tetszik a termék?',
      answer: '14 napon belül indoklás nélkül visszaküldheted a terméket, és visszautaljuk a vételárat. Csak arra kérünk, hogy sértetlenül, eredeti állapotában küldd vissza.'
    }
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-rose-50 mb-6">
            <HelpCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Gyakran ismételt kérdések
          </h2>
          <p className="text-lg text-slate-600">
            Minden, amit tudnod kell a Chat Pack-ről
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 ${
                  openIndex === index
                    ? 'bg-slate-50 border-slate-200 shadow-md'
                    : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-slate-800 pr-4">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className={`w-5 h-5 ${openIndex === index ? 'text-rose-500' : 'text-slate-400'}`} />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-slate-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Reviews Component
function Reviews() {
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    author_name: '',
    rating: 5,
    comment: ''
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews'],
    queryFn: () => base44.entities.Review.filter({ is_approved: true }, '-created_date')
  });

  const createReviewMutation = useMutation({
    mutationFn: (data) => base44.entities.Review.create({ ...data, is_approved: true }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setIsDialogOpen(false);
      setNewReview({ author_name: '', rating: 5, comment: '' });
      toast.success('Köszönjük a véleményed!');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createReviewMutation.mutate(newReview);
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 5;

  return (
    <section className="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-rose-500 font-semibold text-sm tracking-wider uppercase mb-4 block">
            Vélemények
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
            Mit mondanak a vásárlóink?
          </h2>
          
          {reviews.length > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(averageRating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-2xl font-bold text-slate-800">{averageRating}</span>
              <span className="text-slate-500">({reviews.length} vélemény)</span>
            </div>
          )}
        </motion.div>

        {reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-md border border-slate-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-amber-400 flex items-center justify-center text-white font-bold text-lg">
                    {review.author_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-800">{review.author_name}</h4>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= review.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <Quote className="w-8 h-8 text-rose-200 mb-2" />
                <p className="text-slate-600 leading-relaxed">
                  {review.comment}
                </p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-8">
            <p className="text-slate-500 mb-4">Még nincsenek vélemények. Légy te az első!</p>
          </div>
        )}

        <div className="text-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="px-6 py-6 rounded-xl border-2 border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300 font-semibold"
              >
                <Star className="w-5 h-5 mr-2" />
                Írd meg a véleményed
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-slate-800">
                  Oszd meg a véleményed
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                <div>
                  <Label htmlFor="author_name">Neved</Label>
                  <Input
                    id="author_name"
                    value={newReview.author_name}
                    onChange={(e) => setNewReview(prev => ({ ...prev, author_name: e.target.value }))}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Értékelés</Label>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newReview.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300'
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label htmlFor="comment">Véleményed</Label>
                  <Textarea
                    id="comment"
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    required
                    rows={4}
                    className="mt-1"
                    placeholder="Írd le a tapasztalataidat..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={createReviewMutation.isPending}
                  className="w-full py-5 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl"
                >
                  {createReviewMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Küldés...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Vélemény beküldése
                    </span>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-white">
      <div className="bg-gradient-to-r from-rose-500 to-amber-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Készen állsz a mélyebb beszélgetésekre?
              </h3>
              <p className="text-white/80">
                Rendeld meg most és kezdj el igazán beszélgetni!
              </p>
            </div>
            <motion.button
              onClick={() => scrollToSection('product')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-rose-600 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
            >
              Megrendelem – 3 990 Ft
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Chat Pack</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
              35 gondolatébresztő kérdés, amelyek segítenek mélyebb, tartalmasabb 
              beszélgetéseket folytatni a számodra fontos emberekkel.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Navigáció</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollToSection('features')} className="text-slate-400 hover:text-white transition-colors">
                  Miért válaszd?
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('product')} className="text-slate-400 hover:text-white transition-colors">
                  Megrendelés
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Kapcsolat</h4>
            <ul className="space-y-4">
              <li>
                <a href="mailto:info@happycards.hu" className="text-slate-400 hover:text-white transition-colors">
                  info@happycards.hu
                </a>
              </li>
              <li>
                <a href="tel:+36204399796" className="text-slate-400 hover:text-white transition-colors">
                  +36 20 439 9796
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm text-center sm:text-left">
              © {new Date().getFullYear()} Chat Pack. Minden jog fenntartva.
            </p>
            <p className="text-slate-500 text-sm flex items-center gap-1">
              Készítve <Heart className="w-4 h-4 text-rose-500 fill-rose-500" /> -tel Magyarországon
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}