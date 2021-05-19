import express from 'express'
import compression from 'compression'
import lusca from 'lusca'
import dotenv from 'dotenv'

import garmetRouter from './routers/garmet'
import userRouter from './routers/user'
import apiErrorHandler from './middlewares/apiErrorHandler'

dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.set('port', process.env.PORT || 3000)

// Use common 3rd-party middlewares
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))

// Use movie router
app.use('/api/v1/garmets', garmetRouter)

// Use User router
app.use('/api/v1/users', userRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default app
