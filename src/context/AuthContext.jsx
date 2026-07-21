import { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext()

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('bb_users')
      return saved ? JSON.parse(saved) : {}
    } catch { return {} }
  })
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('bb_current_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const persistUsers = (updated) => {
    setUsers(updated)
    localStorage.setItem('bb_users', JSON.stringify(updated))
  }

  const signup = useCallback((name, email, phone, password) => {
    const key = email.toLowerCase().trim()
    if (users[key]) return { ok: false, error: 'An account with this email already exists.' }
    const user = {
      id: generateId(),
      name: name.trim(),
      email: key,
      phone: phone.trim(),
      password,
      addresses: [],
      orders: [],
      createdAt: new Date().toISOString(),
    }
    persistUsers({ ...users, [key]: user })
    setCurrentUser(user)
    localStorage.setItem('bb_current_user', JSON.stringify(user))
    return { ok: true }
  }, [users])

  const login = useCallback((email, password) => {
    const key = email.toLowerCase().trim()
    const user = users[key]
    if (!user) return { ok: false, error: 'No account found with this email.' }
    if (user.password !== password) return { ok: false, error: 'Incorrect password.' }
    setCurrentUser(user)
    localStorage.setItem('bb_current_user', JSON.stringify(user))
    return { ok: true }
  }, [users])

  const forgotPassword = useCallback((email) => {
    const key = email.toLowerCase().trim()
    const user = users[key]
    if (!user) return { ok: false, error: 'No account found with this email.' }
    return { ok: true, message: 'Password reset link sent to your email.' }
  }, [users])

  const logout = useCallback(() => {
    setCurrentUser(null)
    localStorage.removeItem('bb_current_user')
  }, [])

  const updateProfile = useCallback((updates) => {
    if (!currentUser) return
    const updated = { ...currentUser, ...updates }
    setCurrentUser(updated)
    localStorage.setItem('bb_current_user', JSON.stringify(updated))
    persistUsers({ ...users, [currentUser.email]: updated })
  }, [currentUser, users])

  const addAddress = useCallback((address) => {
    if (!currentUser) return
    const addr = { id: generateId(), ...address }
    const updatedUser = { ...currentUser, addresses: [...currentUser.addresses, addr] }
    setCurrentUser(updatedUser)
    localStorage.setItem('bb_current_user', JSON.stringify(updatedUser))
    persistUsers({ ...users, [currentUser.email]: updatedUser })
    return addr
  }, [currentUser, users])

  const removeAddress = useCallback((id) => {
    if (!currentUser) return
    const updatedUser = { ...currentUser, addresses: currentUser.addresses.filter(a => a.id !== id) }
    if (updatedUser.defaultAddressId === id) delete updatedUser.defaultAddressId
    setCurrentUser(updatedUser)
    localStorage.setItem('bb_current_user', JSON.stringify(updatedUser))
    persistUsers({ ...users, [currentUser.email]: updatedUser })
  }, [currentUser, users])

  const updateAddress = useCallback((id, updates) => {
    if (!currentUser) return
    const updatedUser = {
      ...currentUser,
      addresses: currentUser.addresses.map(a => a.id === id ? { ...a, ...updates } : a),
    }
    setCurrentUser(updatedUser)
    localStorage.setItem('bb_current_user', JSON.stringify(updatedUser))
    persistUsers({ ...users, [currentUser.email]: updatedUser })
  }, [currentUser, users])

  const setDefaultAddress = useCallback((id) => {
    if (!currentUser) return
    const updatedUser = { ...currentUser, defaultAddressId: id }
    setCurrentUser(updatedUser)
    localStorage.setItem('bb_current_user', JSON.stringify(updatedUser))
    persistUsers({ ...users, [currentUser.email]: updatedUser })
  }, [currentUser, users])

  const addOrder = useCallback((order) => {
    if (!currentUser) return
    const ord = { id: generateId(), ...order, createdAt: new Date().toISOString(), status: 'confirmed' }
    const updatedUser = { ...currentUser, orders: [ord, ...currentUser.orders] }
    setCurrentUser(updatedUser)
    localStorage.setItem('bb_current_user', JSON.stringify(updatedUser))
    persistUsers({ ...users, [currentUser.email]: updatedUser })
    return ord
  }, [currentUser, users])

  return (
    <AuthContext.Provider value={{ currentUser, signup, login, forgotPassword, logout, updateProfile, addAddress, removeAddress, updateAddress, setDefaultAddress, addOrder }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
