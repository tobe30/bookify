import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { initializePayment, verifyPayment } from '../controllers/payment.controller.js'

const router = express.Router()

router.post('/initialize', protectRoute, initializePayment)
router.get('/verify', protectRoute, verifyPayment)

export default router
