import express from 'express'
import apiRouter from './api'

const app = express()

app.use(express.json())

app.get('/', (_req, res) => {
  res.send('MiniTwitter Server läuft halllelujaah')
})

app.use('/api', apiRouter)

export default app