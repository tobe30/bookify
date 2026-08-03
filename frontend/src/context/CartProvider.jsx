import { useEffect, useState } from 'react'
import CartContext from './cart-context'
import { books } from '../data/books'

const sampleOrder = {
  id: 'BK7B019989',
  createdAt: '2026-07-25T10:30:00.000Z',
  status: 'Pending',
  items: [{ book: books[1], quantity: 1 }],
  subtotal: books[1].price,
  shipping: 2500,
  total: books[1].price + 2500,
  paymentMethod: 'card',
  customer: {
    fullName: 'Madueme Emeka',
    email: 'emeka.madueme@example.com',
    phone: '+234 803 456 7890',
    address: 'FUNAI Student Lodge, Ikwo, Ebonyi State',
  },
}

const getBookId = (book) => book.id ?? book._id

function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = JSON.parse(
        window.localStorage.getItem('bookifyOrders'),
      )
      return Array.isArray(savedOrders) && savedOrders.length > 0
        ? savedOrders
        : [sampleOrder]
    } catch {
      return [sampleOrder]
    }
  })

  useEffect(() => {
    window.localStorage.setItem('bookifyOrders', JSON.stringify(orders))
  }, [orders])

  const addToCart = (book, quantity = 1) => {
    const normalizedBook = { ...book, id: book.id ?? book._id }

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => getBookId(item.book) === getBookId(normalizedBook),
      )

      if (existingItem) {
        return currentItems.map((item) =>
          getBookId(item.book) === getBookId(normalizedBook)
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }

      return [...currentItems, { book: normalizedBook, quantity }]
    })
  }

  const updateCartQuantity = (bookId, quantity) => {
    setItems((currentItems) => {
      if (quantity <= 0) {
        return currentItems.filter((item) => getBookId(item.book) !== bookId)
      }

      return currentItems.map((item) =>
        getBookId(item.book) === bookId ? { ...item, quantity } : item,
      )
    })
  }

  const clearCart = () => setItems([])

  const placeOrder = ({
    subtotal,
    shipping,
    total,
    paymentMethod,
    customer,
  }) => {
    const order = {
      id: `BK${Date.now().toString(36).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'Pending',
      items: items.map((item) => ({ ...item })),
      subtotal,
      shipping,
      total,
      paymentMethod,
      customer,
    }

    setOrders((currentOrders) => [order, ...currentOrders])
    clearCart()
    return order
  }

  const cartCount = items.reduce((total, item) => total + item.quantity, 0)

  const updateOrderStatus = (orderId, status) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    )
  }

  return (
    <CartContext.Provider
      value={{
        items,
        orders,
        addToCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export default CartProvider
