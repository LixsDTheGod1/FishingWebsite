import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import CartDrawer from '../components/CartDrawer'

export default function MainLayout() {
  const [cartOpen, setCartOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-[#020617] text-white">
      <Header onCartClick={() => setCartOpen(true)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
