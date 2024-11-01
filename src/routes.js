import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import UserController from './app/controllers/UserController'
import LoginController from './app/controllers/LoginController'
import ProductController from './app/controllers/ProductController'

import altenticaitorToken from './app/middlewares/altenticaitorToken'
import CategoryController from './app/controllers/CategoryController'
import OrderController from './app/controllers/OrderController'

const routes = new Router()
const upload = multer(multerConfig)

routes.post('/user', UserController.store)
routes.post('/login', LoginController.store)

routes.use(altenticaitorToken)

routes.post('/products', upload.single('file'), ProductController.store)
routes.put('/products/:id', upload.single('file'), ProductController.update)
routes.get('/products', ProductController.index)

routes.post('/category', upload.single('file'), CategoryController.store)
routes.put('/category/:id', upload.single('file'), CategoryController.update)
routes.get('/category', CategoryController.index)

routes.post('/order', OrderController.store)
routes.get('/order', OrderController.index)
routes.put('/order/:id', OrderController.update)

export default routes
