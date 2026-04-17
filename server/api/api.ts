import { Request, Response, Express } from 'express'

// Class to manage specific API routes and handlers
export class API {
  // Properties
  app: Express
  // Constructor initializing the app instance and defining routes
  constructor(app: Express) {
    this.app = app
    // Register a simple GET route at /hello
    this.app.get('/hello', this.sayHello)
  }
  // Methods
  // Handler function to return a greeting message
  private sayHello(req: Request, res: Response) {
    res.send('Hello There!')
  }
}
