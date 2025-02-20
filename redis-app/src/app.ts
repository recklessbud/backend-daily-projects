import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'

dotenv.config()
const app = express()

import restaurantsRouter from './routes/restaurants.ts'
import cuisinesRouter from './routes/cuisines.ts'
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware.ts'

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/restaurants', restaurantsRouter)
app.use('/cuisines', cuisinesRouter)	


app.use(errorHandlerMiddleware)
export default app   