import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addItem = useCallback((item) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return
    setCartItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item?.bogoPairId) return prev
      return prev.map(i => i.id === id ? { ...i, quantity } : i)
    })
  }, [])

  const removeItem = useCallback((id) => {
    setCartItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item?.bogoPairId) {
        return prev.filter(i => i.id !== id && i.id !== item.bogoPairId)
      }
      return prev.filter(i => i.id !== id)
    })
  }, [])

  const clearCart = useCallback(() => {
    setCartItems([])
  }, [])

  const itemCount = cartItems.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = cartItems.reduce((sum, i) => sum + i.priceNum * i.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addItem, updateQuantity, removeItem, clearCart, itemCount, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
