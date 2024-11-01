import * as Yup from 'yup'
import Product from '../models/Product'
import Category from '../models/Category'
import User from '../models/User'
import Order from '../schemas/Order'

class OrderController {
	async store(req, res) {
		const schema = Yup.object().shape({
			products: Yup.array()
				.required()
				.of(
					Yup.object().shape({
						id: Yup.number().required(),
						quantity: Yup.number().required(),
					}),
				),
		})

		try {
			await schema.validateSync(req.body, { abortEarly: false })
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}

		const productsId = req.body.products.map((product) => product.id)

		const updatedProducts = await Product.findAll({
			where: {
				id: productsId,
			},
			include: [
				{
					model: Category,
					as: 'category',
					attributes: ['name'],
				},
			],
		})

		const editedProduct = updatedProducts.map((product) => {
			const productIndex = req.body.products.findIndex(
				(reqProduct) => reqProduct.id === product.id,
			)

			const newProduct = {
				id: product.id,
				name: product.name,
				price: product.price,
				category: product.category.name,
				url: product.url,
				quantity: req.body.products[productIndex].quantity,
			}

			return newProduct
		})
		const order = {
			user: {
				id: req.userId,
				name: req.userName,
			},
			products: editedProduct,
			status: 'Pedido realizado',
		}

		const orderResponse = await Order.create(order)

		return res.status(201).json(orderResponse)
	}

	async index(req, res) {
		const { admin: isAdmin } = await User.findByPk(req.userId)

		if (!isAdmin) {
			return res.status(401).json({ message: 'usuário sem permissão' })
		}
		const orders = await Order.find()

		return res.json(orders)
	}

	async update(req, res) {
		const { id } = req.params
		const { status } = req.body

		const schema = Yup.object().shape({
			status: Yup.string().required(),
		})
		try {
			await schema.validateSync(req.body, { abortEarly: false })
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}

		const { admin: isAdmin } = await User.findByPk(req.userId)

		if (!isAdmin) {
			return res.status(401).json({ message: 'usuário sem permissão' })
		}

		try {
			await Order.updateOne({ _id: id }, { status })
		} catch (error) {
			return res.json({ message: error.message })
		}
		return res.json({ message: 'Pedido atualizado com Sucesso' })
	}
}

export default new OrderController()
