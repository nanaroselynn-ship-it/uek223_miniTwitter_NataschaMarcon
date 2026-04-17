import express from 'express'
import apiRouter from './api'

// Initialize the Express application
const app = express()

// Middleware to parse incoming JSON payloads
app.use(express.json())
// Serve static assets from the 'client' directory
app.use(express.static('client'))

// Route to serve the main HTML file
app.get('/', (_req, res) => {
  res.sendFile('index.html', { root: 'client' })
})

// Mount the API router on the '/api' path
app.use('/api', apiRouter)

export default app
