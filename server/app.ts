import express from 'express'
import apiRouter from './api'

const app = express()

app.use(express.json())
app.use(express.static('client'))

app.get('/', (_req, res) => {
  res.sendFile('index.html', { root: 'client' })
})

app.use('/api', apiRouter)

export default app