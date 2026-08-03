import mongoose from 'mongoose'
import Book from '../models/Book.js'
import Order from '../models/Order.js'
import User from '../models/User.js'

const paystackBaseUrl = 'https://api.paystack.co'

const getPaystackSecret = () => {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error('Missing PAYSTACK_SECRET_KEY in environment variables')
  }

  return process.env.PAYSTACK_SECRET_KEY
}

const getFrontendUrl = () => {
  return process.env.FRONTEND_BASE_URL || 'http://localhost:5173'
}

export const initializePayment = async (req, res) => {
  try {
    const userId = req.user?._id
    const { deliveryInfo, items, saveAddress, paymentMethod } = req.body ?? {}

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'You must be logged in to place an order',
      })
    }

    const finalDeliveryInfo = {
      fullName: deliveryInfo?.fullName?.trim() || req.user.fullName,
      email: deliveryInfo?.email?.toLowerCase().trim() || req.user.email,
      phone: deliveryInfo?.phone?.trim() || req.user.savedAddress?.phone,
      address: deliveryInfo?.address?.trim() || req.user.savedAddress?.address,
    }

    const payment = paymentMethod || 'CARD'

    if (
      !finalDeliveryInfo.fullName ||
      !finalDeliveryInfo.email ||
      !finalDeliveryInfo.phone ||
      !finalDeliveryInfo.address ||
      !payment
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Full name, email, phone number, delivery address and payment method are required',
      })
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your order must contain at least one book',
      })
    }

    const requestedItems = new Map()

    for (const item of items) {
      const bookId = item.bookId ?? item.id
      const quantity = Number(item.quantity)

      if (
        !mongoose.isValidObjectId(bookId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: 'Every order item must have a valid book ID and quantity',
        })
      }

      requestedItems.set(
        bookId.toString(),
        (requestedItems.get(bookId.toString()) ?? 0) + quantity,
      )
    }

    const books = await Book.find({
      _id: { $in: [...requestedItems.keys()] },
    })

    if (books.length !== requestedItems.size) {
      return res.status(404).json({
        success: false,
        message: 'One or more books could not be found',
      })
    }

    let subtotal = 0
    const orderItems = []

    for (const book of books) {
      const quantity = requestedItems.get(book._id.toString())

      if (book.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${book.stock} copies of "${book.title}" are available`,
        })
      }

      orderItems.push({
        bookId: book._id,
        quantity,
        price: book.price,
      })

      subtotal += book.price * quantity
    }

    const shipping = subtotal >= 25000 ? 0 : 2500
    const total = subtotal + shipping

    const order = await Order.create({
      userId,
      deliveryInfo: finalDeliveryInfo,
      paymentMethod: payment,
      subtotal,
      shipping,
      total,
      orderItems,
      isPaid: false,
      paymentReference: null,
    })

    if (saveAddress === true || saveAddress === 'true') {
      await User.findByIdAndUpdate(userId, {
        savedAddress: {
          phone: finalDeliveryInfo.phone,
          address: finalDeliveryInfo.address,
        },
      })
    }

    await Book.bulkWrite(
      orderItems.map((item) => ({
        updateOne: {
          filter: { _id: item.bookId },
          update: { $inc: { stock: -item.quantity } },
        },
      })),
    )

    const paystackSecret = getPaystackSecret()
    const callbackUrl = `${getFrontendUrl()}/payment/callback`
    const reference = order._id.toString()

    const response = await fetch(`${paystackBaseUrl}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: finalDeliveryInfo.email,
        amount: total * 100,
        reference,
        callback_url: callbackUrl,
        metadata: {
          orderId: order._id.toString(),
        },
      }),
    })

    const data = await response.json()

    if (!data.status) {
      return res.status(502).json({
        success: false,
        message: data.message || 'Failed to initialize Paystack payment',
      })
    }

    return res.status(201).json({
      success: true,
      message: 'Paystack payment initialized successfully',
      authorization_url: data.data.authorization_url,
      orderId: order._id.toString(),
      reference: data.data.reference,
    })
  } catch (error) {
    console.error('Error initializing Paystack payment:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

export const verifyPayment = async (req, res) => {
  try {
    const reference = req.query.reference

    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required',
      })
    }

    const paystackSecret = getPaystackSecret()
    const response = await fetch(`${paystackBaseUrl}/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecret}`,
      },
    })

    const data = await response.json()

    if (!data.status) {
      return res.status(400).json({
        success: false,
        message: data.message || 'Unable to verify payment',
      })
    }

    if (data.data.status !== 'success') {
      return res.status(402).json({
        success: false,
        message: 'Payment was not successful',
      })
    }

    const orderId = data.data.metadata?.orderId ?? reference
    const order = await Order.findOneAndUpdate(
      { _id: orderId },
      { isPaid: true, status: 'Processing', paymentReference: reference },
      { new: true },
    )

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found for this payment reference',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      order,
    })
  } catch (error) {
    console.error('Error verifying Paystack payment:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
