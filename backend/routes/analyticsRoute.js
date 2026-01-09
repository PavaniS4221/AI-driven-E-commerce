import express from 'express'
import { getSalesForecast } from '../controllers/analyticsController.js'
import adminAuth from '../middleware/adminAuth.js'

const analyticsRouter = express.Router()

analyticsRouter.get('/forecast', adminAuth, getSalesForecast)

export default analyticsRouter