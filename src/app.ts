import express from 'express'
import compression from 'compression'
import lusca from 'lusca'
import dotenv from 'dotenv'

import movieRouter from './routers/movie'
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
app.use('/api/v1/movies', movieRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default app
