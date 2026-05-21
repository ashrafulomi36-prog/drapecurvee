'use client'
import { useState, useEffect, useRef } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Product = { id: number; name: string; price: string; description: string; tag?: string; img: string }
type CartItem = {
  id: number
  name: string
  price: number
  size: string
  colour: string
  quantity: number
  img: string
}

// TODO: Replace with your WhatsApp business number (e.g. 8801XXXXXXXXX)
const WHATSAPP_NUMBER = '8801815569525'
const DELIVERY_CHARGE = 150

// ─── Data ────────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  { id: 1, name: 'DC Drop Shoulder 01', price: '৳1,699', description: 'Acid-washed 250 GSM combed cotton. Drop shoulder cut. Unstructured silhouette for the ones who drape different.', tag: 'Drop 01', img: 'product-01.jpg' },
  { id: 2, name: 'DC Drop Shoulder 02', price: '৳1,699', description: 'Stone-washed charcoal. Oversized boxy fit with ribbed crew neck. Limited to 10 pieces.', tag: 'Limited', img: 'product-02.jpg' },
  { id: 3, name: 'DC Drop Shoulder 03', price: '৳1,699', description: 'Vintage white, sun-faded finish. The fabric falls. The crowd stares.', img: 'product-03.jpg' },
  { id: 4, name: 'DC Archive Piece',    price: '৳1,899', description: "Premium heavyweight 260 GSM. Jet black mineral wash. Once it's gone, it's archived forever.", tag: 'Archive', img: 'product-04.jpg' },
]
const SIZES   = ['M','L','XL',]
const COLOURS = ['Acid Wash Black']
const NAV_ITEMS = [
  { label: 'Drop Shoulder', href: '#products' },
  { label: 'Old Money Polo', href: '#products' },
  { label: 'Sneakers', href: '#', soon: true },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parsePrice(priceStr: string): number {
  return parseInt(priceStr.replace(/[^\d]/g, ''), 10) || 0
}

function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`
}

function cartItemKey(id: number, size: string, colour: string): string {
  return `${id}-${size}-${colour}`
}

function cartTotalItems(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0)
}

function cartSubtotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function isValidBangladeshMobile(mobile: string): boolean {
  return /^01\d{9}$/.test(mobile.trim())
}

function buildWhatsAppMessage(cart: CartItem[], mobile: string, address: string): string {
  const subtotal = cartSubtotal(cart)
  const total = subtotal + DELIVERY_CHARGE
  const lines: string[] = [
    '🛍️ NEW ORDER — DRAPECURVE',
    '━━━━━━━━━━━━━━━━━━━━━',
    '',
  ]
  cart.forEach(item => {
    const lineTotal = item.price * item.quantity
    lines.push(
      `▪ ${item.name}`,
      `  Size: ${item.size} | Colour: ${item.colour}`,
      `  Qty: ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(lineTotal)}`,
      ''
    )
  })
  lines.push(
    '─────────────────────',
    `📦 Subtotal:         ${formatPrice(subtotal)}`,
    `🚚 Delivery Charge:   ${formatPrice(DELIVERY_CHARGE)}`,
    `💰 TOTAL:            ${formatPrice(total)}`,
    '─────────────────────',
    '',
    `📱 Mobile: ${mobile.trim()}`,
    `📍 Address: ${address.trim()}`,
    '',
    'Thank you! We will confirm your order shortly.'
  )
  return lines.join('\n')
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ visible }: { visible: boolean }) {
  if (!visible) return null
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 bg-[#111] border border-white/10 text-white text-xs tracking-widest uppercase shadow-lg">
      Added to cart ✓
    </div>
  )
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar({ cartCount, onOpenCart }: { cartCount: number; onOpenCart: () => void }) {
  const [open, setOpen]         = useState(false)
  const [itemsOpen, setItemsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setItemsOpen(false) }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const go = (id: string) => {
    setOpen(false); setItemsOpen(false)
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16 md:h-20">

        <a href="#home" onClick={() => go('#home')} className="flex items-center gap-2.5 group">
          <svg width="28" height="32" viewBox="0 0 200 220" className="opacity-90 group-hover:opacity-100 transition-opacity" fill="white">
            <path d="M20 20 L20 140 L70 140 Q130 140 130 80 Q130 20 70 20 Z M50 45 L65 45 Q100 45 100 80 Q100 115 65 115 L50 115 Z"/>
            <path d="M120 20 Q185 20 185 60 L160 60 Q160 45 135 45 Q110 45 110 80 Q110 115 135 115 Q160 115 160 100 L185 100 Q185 140 120 140 Q80 140 80 80 Q80 20 120 20 Z"/>
            <text x="100" y="195" fontFamily="serif" fontSize="26" textAnchor="middle" letterSpacing="1">DrapeCurve</text>
          </svg>
          <span className="font-display text-white text-lg tracking-[0.12em] uppercase select-none hidden sm:block">DrapeCurve</span>
        </a>

        <div className="flex items-center gap-2">
          {/* Cart icon */}
          <button onClick={onOpenCart} className="relative p-2 text-white hover:text-white/80 transition-colors" aria-label="Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-white text-black text-[10px] font-medium rounded-full px-1">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </button>

          {/* Hamburger */}
          <div ref={ref} className="relative">
            <button onClick={() => setOpen(!open)} className="flex flex-col gap-[5px] p-2" aria-label="Menu">
              <span className={`block h-[1.5px] bg-white transition-all duration-300 origin-center ${open ? 'w-6 rotate-45 translate-y-[6.5px]' : 'w-6'}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-300 ${open ? 'w-0 opacity-0' : 'w-4'}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-300 origin-center ${open ? 'w-6 -rotate-45 -translate-y-[6.5px]' : 'w-6'}`} />
            </button>

            <div className={`absolute right-0 top-12 w-56 bg-[#111] border border-white/8 transition-all duration-300 ${open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
              <a href="#home" onClick={() => go('#home')} className="block px-6 py-3.5 text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">Home</a>

              <div>
                <button onClick={() => setItemsOpen(!itemsOpen)} className="w-full flex items-center justify-between px-6 py-3.5 text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">
                  <span>Items</span>
                  <span className={`transition-transform duration-200 ${itemsOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${itemsOpen ? 'max-h-48' : 'max-h-0'}`}>
                  {NAV_ITEMS.map(item => (
                    <a key={item.label} href={item.href} onClick={() => { if (!item.soon) go(item.href) }}
                      className="flex items-center justify-between pl-10 pr-6 py-3 text-xs tracking-[0.15em] uppercase text-white/50 hover:text-white hover:bg-white/5 transition-colors border-b border-white/[0.03]">
                      <span>{item.label}</span>
                      {item.soon && <span className="text-[9px] tracking-widest bg-white/10 text-white/40 px-2 py-0.5">SOON</span>}
                    </a>
                  ))}
                </div>
              </div>

              <a href="#contact" onClick={() => go('#contact')} className="block px-6 py-3.5 text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white hover:bg-white/5 transition-colors border-b border-white/5">Contact</a>
              <a href="#queries"  onClick={() => go('#queries')}  className="block px-6 py-3.5 text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white hover:bg-white/5 transition-colors">Queries</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

// ─── Product Modal ────────────────────────────────────────────────────────────
function ProductModal({
  product,
  onClose,
  onAddToCart,
}: {
  product: Product
  onClose: () => void
  onAddToCart: (item: Omit<CartItem, 'quantity'> & { quantity: number }) => void
}) {
  const [size, setSize] = useState('')
  const [colour, setColour] = useState('')
  const [quantity, setQuantity] = useState(1)

  const canAdd = size && colour

  const handleAdd = () => {
    if (!canAdd) return
    onAddToCart({
      id: product.id,
      name: product.name,
      price: parsePrice(product.price),
      size,
      colour,
      quantity,
      img: product.img,
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="relative w-full max-w-lg bg-[#111] border border-white/8 max-h-[90vh] overflow-y-auto">

        <div className="flex items-center justify-between px-8 py-6 border-b border-white/8">
          <h2 className="font-display text-lg tracking-widest text-white uppercase">{product.name}</h2>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>

        <div className="px-8 py-6 space-y-6">

          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3">Size</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(s => (
                <button type="button" key={s} onClick={() => setSize(s)}
                  className={`w-12 h-10 text-xs tracking-wider border transition-all duration-200 ${size === s ? 'bg-white text-black border-white' : 'bg-transparent text-white/60 border-white/15 hover:border-white/40'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3">Colour</label>
            <div className="space-y-2">
              {COLOURS.map(c => (
                <button type="button" key={c} onClick={() => setColour(c)}
                  className={`w-full text-left px-4 py-2.5 text-xs tracking-wider border transition-all duration-200 ${colour === c ? 'bg-white text-black border-white' : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <button type="button" onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 border border-white/15 text-white/60 hover:border-white/40 hover:text-white transition-all text-lg">−</button>
              <span className="text-white text-lg w-8 text-center">{quantity}</span>
              <button type="button" onClick={() => setQuantity(q => Math.min(10, q + 1))} className="w-10 h-10 border border-white/15 text-white/60 hover:border-white/40 hover:text-white transition-all text-lg">+</button>
            </div>
          </div>

          <button type="button" onClick={handleAdd} disabled={!canAdd}
            className="w-full py-4 bg-white text-black text-xs tracking-[0.3em] uppercase font-medium hover:bg-white/90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Cart View ────────────────────────────────────────────────────────────────
function CartView({
  cart,
  onClose,
  onUpdateQuantity,
  onRemove,
  onClearAndClose,
}: {
  cart: CartItem[]
  onClose: () => void
  onUpdateQuantity: (key: string, quantity: number) => void
  onRemove: (key: string) => void
  onClearAndClose: () => void
}) {
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')
  const [mobileError, setMobileError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [orderSent, setOrderSent] = useState(false)
  const [confirmedMobile, setConfirmedMobile] = useState('')

  const subtotal = cartSubtotal(cart)
  const total = subtotal + DELIVERY_CHARGE

  const validate = (): boolean => {
    let valid = true
    setMobileError('')
    setAddressError('')

    if (!mobile.trim()) {
      setMobileError('Please enter your mobile number')
      valid = false
    } else if (!isValidBangladeshMobile(mobile)) {
      setMobileError('Please enter a valid Bangladeshi mobile number')
      valid = false
    }

    if (!address.trim()) {
      setAddressError('Please enter your delivery address')
      valid = false
    }

    return valid
  }

  const handleWhatsApp = () => {
    if (!validate()) return
    const message = buildWhatsAppMessage(cart, mobile, address)
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
    setConfirmedMobile(mobile.trim())
    setOrderSent(true)
  }

  if (orderSent) {
    return (
      <div className="fixed inset-0 z-[250] bg-[#0a0a0a] flex flex-col">
        <div className="flex items-center justify-between px-6 md:px-10 h-16 md:h-20 border-b border-[#222]">
          <h2 className="font-display text-sm tracking-[0.25em] text-white uppercase">Your Cart</h2>
          <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors text-xl leading-none">✕</button>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
          <div className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center mb-8">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h3 className="font-display text-2xl tracking-[0.2em] text-white uppercase mb-4">Order Sent!</h3>
          <p className="text-white/50 text-sm leading-relaxed max-w-sm mb-10">
            Your order has been sent to our WhatsApp.
            We will call you at <span className="text-white">{confirmedMobile}</span> to confirm.
          </p>
          <button onClick={onClearAndClose}
            className="w-full max-w-xs py-4 bg-white text-black text-xs tracking-[0.3em] uppercase hover:bg-white/90 transition-colors">
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[250] bg-[#0a0a0a] flex flex-col">
      <div className="flex items-center justify-between px-6 md:px-10 h-16 md:h-20 border-b border-[#222] shrink-0">
        <h2 className="font-display text-sm tracking-[0.25em] text-white uppercase">Your Cart</h2>
        <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors text-xl leading-none" aria-label="Close cart">✕</button>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center px-8 gap-8">
          <p className="text-white/40 text-sm tracking-wider">Your cart is empty.</p>
          <button onClick={onClose}
            className="px-10 py-4 border border-white/20 text-white text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full px-6 md:px-10 py-6">
            {cart.map(item => {
              const key = cartItemKey(item.id, item.size, item.colour)
              const itemSubtotal = item.price * item.quantity
              return (
                <div key={key} className="py-6 border-b border-[#222]">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h3 className="font-display text-sm tracking-[0.12em] text-white uppercase">{item.name}</h3>
                    <span className="text-sm text-white/60 shrink-0">{formatPrice(item.price)}</span>
                  </div>
                  <p className="text-xs text-white/40 tracking-wide mb-4">
                    Size: {item.size}  |  Colour: {item.colour}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => onUpdateQuantity(key, Math.max(1, item.quantity - 1))}
                        className="w-9 h-9 border border-white/15 text-white/60 hover:border-white/40 hover:text-white transition-all">−</button>
                      <span className="text-white w-6 text-center">{item.quantity}</span>
                      <button type="button" onClick={() => onUpdateQuantity(key, item.quantity + 1)}
                        className="w-9 h-9 border border-white/15 text-white/60 hover:border-white/40 hover:text-white transition-all">+</button>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-0.5">Subtotal</p>
                      <p className="text-sm text-white">{formatPrice(itemSubtotal)}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => onRemove(key)}
                    className="mt-4 text-[10px] tracking-[0.25em] uppercase text-white/40 hover:text-[#ef4444] transition-colors">
                    Remove
                  </button>
                </div>
              )
            })}

            {/* Order summary */}
            <div className="py-8 space-y-3 border-b border-[#222]">
              <div className="flex justify-between text-sm">
                <span className="text-white/50 tracking-wide">Subtotal:</span>
                <span className="text-white">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[10px] tracking-[0.15em] uppercase text-white/50">Delivery Charge:</span>
                <span className="text-white">{formatPrice(DELIVERY_CHARGE)}</span>
              </div>
              <div className="pt-3 border-t border-[#333] flex justify-between">
                <span className="text-[10px] tracking-[0.25em] uppercase text-white/60">Total:</span>
                <span className="text-white font-medium">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Contact fields */}
            <div className="py-8 space-y-6">
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3">Mobile Number</label>
                <input type="tel" placeholder="01XXXXXXXXX" value={mobile} onChange={e => { setMobile(e.target.value); setMobileError('') }}
                  className="w-full bg-transparent border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:border-white/40 focus:outline-none transition-colors" />
                {mobileError && <p className="mt-2 text-[#ef4444] text-xs">{mobileError}</p>}
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3">Delivery Address</label>
                <textarea rows={4} placeholder="Full address including district..." value={address} onChange={e => { setAddress(e.target.value); setAddressError('') }}
                  className="w-full bg-transparent border border-white/10 text-white text-sm px-4 py-3 placeholder-white/20 focus:border-white/40 focus:outline-none transition-colors resize-none" />
                {addressError && <p className="mt-2 text-[#ef4444] text-xs">{addressError}</p>}
              </div>

              <button type="button" onClick={handleWhatsApp}
                className="w-full py-4 bg-white text-black text-xs tracking-[0.3em] uppercase font-medium hover:bg-white/90 transition-all duration-200 flex items-center justify-center gap-2">
                <span>📱</span>
                <span>Confirm Order Via WhatsApp →</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product
  onAddToCart: (item: Omit<CartItem, 'quantity'> & { quantity: number }) => void
}) {
  const [showModal, setShowModal] = useState(false)
  return (
    <>
      <div className="group relative flex flex-col bg-[#0e0e0e] border border-white/5 hover:border-white/10 transition-all duration-500">
        <div className="relative aspect-[3/4] overflow-hidden bg-[#151515]">
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center">
              <span className="font-display text-white/20 text-xs tracking-widest">DC</span>
            </div>
            <p className="text-white/15 text-[10px] tracking-[0.3em] uppercase">Add photo to</p>
            <p className="text-white/10 text-[9px] tracking-wider">/public/products/{product.img}</p>
          </div>
          {product.tag && (
            <div className="absolute top-4 left-4">
              <span className="text-[9px] tracking-[0.25em] uppercase bg-white text-black px-2.5 py-1">{product.tag}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
        </div>
        <div className="p-5 flex flex-col gap-4 flex-1">
          <div>
            <div className="flex items-start justify-between mb-1.5">
              <h3 className="font-display text-sm tracking-[0.15em] uppercase text-white">{product.name}</h3>
              <span className="text-sm tracking-wider text-white/60 shrink-0 ml-2">{product.price}</span>
            </div>
            <p className="text-xs text-white/35 leading-relaxed tracking-wide">{product.description}</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="mt-auto w-full py-3 border border-white/20 text-white text-[10px] tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group/btn">
            <span>Buy Now</span>
            <span className="transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
          </button>
        </div>
      </div>
      {showModal && (
        <ProductModal
          product={product}
          onClose={() => setShowModal(false)}
          onAddToCart={onAddToCart}
        />
      )}
    </>
  )
}

// ─── Scroll To Top ────────────────────────────────────────────────────────────
function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  if (!visible) return null
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-8 right-8 z-50 w-10 h-10 bg-white text-black flex items-center justify-center hover:bg-white/90 transition-all duration-300"
      aria-label="Back to top">↑</button>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="contact" className="bg-[#080808] border-t border-white/5 mt-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          <div>
            <p className="font-display text-2xl tracking-[0.2em] text-white uppercase mb-4">DrapeCurve</p>
            <p className="text-white/30 text-xs tracking-[0.2em] uppercase mb-6">Drape Different.</p>
            <p className="text-white/25 text-xs leading-relaxed max-w-56">Premium oversized streetwear crafted for the ones who move with intention.</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-5">Contact</p>
            <div className="space-y-3 text-xs text-white/40 tracking-wide">
              <p>📱 WhatsApp: +8801815569525</p>
              <p>✉️ drapecurve.dc@.com</p>
              <p>📍 Chittagong, Bangladesh</p>
            </div>
          </div>
          <div id="queries">
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/30 mb-5">Follow Us</p>
            <div className="space-y-3">
              {[
                { name: 'Instagram', handle: '@drapecurve', href: 'https://www.instagram.com/drapecurve/' },
                { name: 'Facebook',  handle: 'DrapeCurve', href: 'https://www.facebook.com/DrapeCurve' },
                { name: 'TikTok',   handle: '@drapecurve', href: 'https://www.tiktok.com/@drapecurve' },
              ].map(s => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 group">
                  <span className="text-[10px] tracking-[0.15em] uppercase text-white/25 w-20">{s.name}</span>
                  <span className="text-xs text-white/40 group-hover:text-white transition-colors">{s.handle}</span>
                </a>
              ))}
            </div>
            <div className="mt-8 pt-8 border-t border-white/5">
              <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 mb-2">For Queries</p>
              <p className="text-xs text-white/35 leading-relaxed">DM us on Instagram or WhatsApp. We respond within 24 hours.</p>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/15 text-[10px] tracking-[0.2em] uppercase">© 2025 DrapeCurve. All rights reserved.</p>
          <p className="text-white/10 text-[10px] tracking-widest uppercase">Drop 01 — Archive Forever</p>
        </div>
      </div>
    </footer>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)

  const cartCount = cartTotalItems(cart)

  const showToast = () => {
    setToastVisible(true)
    setTimeout(() => setToastVisible(false), 2000)
  }

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity: number }) => {
    const key = cartItemKey(item.id, item.size, item.colour)
    setCart(prev => {
      const existing = prev.find(
        i => cartItemKey(i.id, i.size, i.colour) === key
      )
      if (existing) {
        return prev.map(i =>
          cartItemKey(i.id, i.size, i.colour) === key
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        )
      }
      return [...prev, { ...item }]
    })
    showToast()
  }

  const updateQuantity = (key: string, quantity: number) => {
    setCart(prev =>
      prev.map(i =>
        cartItemKey(i.id, i.size, i.colour) === key ? { ...i, quantity } : i
      )
    )
  }

  const removeFromCart = (key: string) => {
    setCart(prev => prev.filter(i => cartItemKey(i.id, i.size, i.colour) !== key))
  }

  const clearCartAndClose = () => {
    setCart([])
    setCartOpen(false)
  }

  return (
    <main className="min-h-screen bg-[#080808] overflow-x-hidden">
      <Navbar cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />
      <Toast visible={toastVisible} />

      {cartOpen && (
        <CartView
          cart={cart}
          onClose={() => setCartOpen(false)}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onClearAndClose={clearCartAndClose}
        />
      )}

      {/* ── HERO ── */}
      <section id="home" className="relative min-h-screen flex flex-col justify-end pb-20 px-6 md:px-10 pt-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-white/[0.015] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display text-[22vw] tracking-tight text-white/[0.018] uppercase leading-none whitespace-nowrap">DRAPE</span>
        </div>
        <div className="absolute left-10 top-0 bottom-0 w-px bg-white/5 hidden md:block" />

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
                Premium Streetwear — Bangladesh
              </p>
              <div className="overflow-hidden mb-2">
                <h1 className="font-display text-[clamp(56px,12vw,140px)] leading-[0.88] tracking-[0.04em] text-white uppercase animate-slide-up" style={{ animationDelay: '0.2s' }}>
                  Drape
                </h1>
              </div>
              <div className="overflow-hidden">
                <h1 className="font-display text-[clamp(56px,12vw,140px)] leading-[0.88] tracking-[0.04em] uppercase animate-slide-up" style={{ animationDelay: '0.35s' }}>
                  <span className="text-white/15" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>Curve</span>
                </h1>
              </div>
              <div className="mt-8 flex items-center gap-6 animate-fade-up" style={{ animationDelay: '0.55s' }}>
                <p className="text-xs tracking-[0.35em] uppercase text-white/40">Drape Different.</p>
                <span className="w-12 h-px bg-white/15" />
                <p className="text-xs tracking-[0.2em] text-white/20">Drop 01</p>
              </div>
            </div>

            <div className="flex flex-col gap-5 md:items-end animate-fade-up" style={{ animationDelay: '0.5s' }}>
              <div className="md:text-right">
                <p className="text-white/25 text-xs tracking-widest uppercase mb-1">Limited Release</p>
                <p className="text-white text-2xl font-display tracking-wider">10 Pieces Only</p>
              </div>
              <a href="#products" className="inline-flex items-center gap-3 bg-white text-black text-[10px] tracking-[0.3em] uppercase px-8 py-4 hover:bg-white/90 transition-all duration-300 group">
                <span>Explore Collection</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </a>
              <p className="text-white/15 text-[10px] tracking-widest uppercase">Cash on Delivery · BD</p>
            </div>
          </div>

          <div className="mt-16 pt-6 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              {[{ label: 'Fabric', value: '250 GSM Cotton' }, { label: 'Cut', value: 'Drop Shoulder' }, { label: 'Finish', value: 'Acid Wash' }].map(s => (
                <div key={s.label}>
                  <p className="text-[9px] tracking-[0.25em] uppercase text-white/20 mb-0.5">{s.label}</p>
                  <p className="text-xs tracking-wider text-white/50">{s.value}</p>
                </div>
              ))}
            </div>
            <p className="text-white/15 text-[10px] tracking-[0.25em] uppercase">Once it&apos;s gone — archived forever.</p>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-white/5 py-4 overflow-hidden bg-[#0a0a0a]">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(3).fill(null).map((_, i) => (
            <span key={i} className="mx-12 text-[10px] tracking-[0.4em] uppercase text-white/20 flex items-center gap-12">
              <span>DrapeCurve</span><span className="w-1 h-1 rounded-full bg-white/15 inline-block" />
              <span>Drape Different</span><span className="w-1 h-1 rounded-full bg-white/15 inline-block" />
              <span>Drop 01</span><span className="w-1 h-1 rounded-full bg-white/15 inline-block" />
              <span>250 GSM Premium Cotton</span><span className="w-1 h-1 rounded-full bg-white/15 inline-block" />
              <span>Limited Release</span><span className="w-1 h-1 rounded-full bg-white/15 inline-block" />
            </span>
          ))}
        </div>
      </div>

      {/* ── PRODUCTS ── */}
      <section id="products" className="max-w-7xl mx-auto px-6 md:px-10 py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <p className="text-[10px] tracking-[0.35em] uppercase text-white/25 mb-3">Collection</p>
            <h2 className="font-display text-4xl md:text-5xl tracking-[0.05em] text-white uppercase">
              Drop Shoulder<br />
              <span className="text-white/20" style={{ WebkitTextStroke: '0.5px rgba(255,255,255,0.25)' }}>Oversized Tees</span>
            </h2>
          </div>
          <p className="text-white/25 text-xs tracking-wider max-w-64 leading-relaxed md:text-right">
            Each piece is acid-washed by hand. No two look exactly the same. 10 pieces exist.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {PRODUCTS.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
          ))}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px border border-white/5">
          {[
            { icon: '📦', label: 'Free Delivery', sub: 'Inside Chattogram and for the repeated customer' },
            { icon: '💵', label: 'Cash on Delivery', sub: 'Pay at doorstep' },
            { icon: '↩', label: 'Easy Returns', sub: 'If product has any issues' },
            { icon: '✦', label: 'Limited Pieces', sub: 'No restock ever' },
          ].map(f => (
            <div key={f.label} className="bg-[#0e0e0e] px-6 py-6 flex flex-col gap-2">
              <span className="text-xl">{f.icon}</span>
              <p className="text-white text-xs tracking-wider">{f.label}</p>
              <p className="text-white/25 text-[10px] tracking-wide">{f.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRAND STATEMENT ── */}
      <section className="relative border-y border-white/5 py-28 px-6 md:px-10 overflow-hidden bg-[#090909]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="font-display text-[18vw] text-white/[0.015] uppercase leading-none tracking-tight">DIFFERENT</span>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/20 mb-8">The Philosophy</p>
          <blockquote className="font-display text-3xl md:text-5xl lg:text-6xl text-white leading-tight tracking-wide mb-8">
            &ldquo;The fabric falls.<br />
            <span className="text-white/30">The crowd stares.&rdquo;</span>
          </blockquote>
          <p className="text-white/25 text-sm tracking-wider max-w-md mx-auto leading-relaxed">
            Comfort was never the compromise. DRAPECURVE exists for the ones who understand that how you wear something matters more than what you wear.
          </p>
        </div>
      </section>

      <Footer />
      <ScrollToTop />
    </main>
  )
}
