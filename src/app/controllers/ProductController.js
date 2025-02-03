import * as Yup from 'yup'
import { Op } from 'sequelize'
import Product from '../models/Product'
import Category from '../models/Category'
import User from '../models/User'

class ProductController {
	async store(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string().required(),
			price: Yup.number().required(),
			category_id: Yup.number().required(),
			offer: Yup.boolean(),
		})

		try {
			await schema.validateSync(req.body, { abortEarly: false })
		} catch (erro) {
			return res.status(400).json({ erro: erro.message })
		}

		const { admin: isAdmin } = await User.findByPk(req.userId)

		if (!isAdmin) {
			return res.status(401).json({ message: 'usuário sem permissão' })
		}

		const { filename: path } = req.file
		const { name, price, category_id, offer } = req.body

		const nameExists = await Product.findOne({
			where: { name },
		})
		if (nameExists) {
			return res
				.status(400)
				.json({ Erro: 'Já existe um Produto com esse nome cadastrado' })
		}

		const product = await Product.create({
			name,
			price,
			category_id,
			path,
			offer,
		})
		return res.json(product)
	}
	async index(req, res) {
		const products = await Product.findAll({
			include: [
				{
					model: Category,
					as: 'category',
					attributes: ['id', 'name'],
				},
			],
		})

		return res.json(products)
	}

	async update(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string(),
			price: Yup.number(),
			category_id: Yup.number(),
			offer: Yup.boolean(),
		})

		try {
			await schema.validateSync(req.body, { abortEarly: false })
		} catch (erro) {
			return res.status(400).json({ erro: erro.message })
		}

		const { admin: isAdmin } = await User.findByPk(req.userId)

		if (!isAdmin) {
			return res.status(401).json({ message: 'usuário sem permissão' })
		}

		const { id } = req.params

		const product = await Product.findByPk(id)

		if (!product) {
			return res
				.status(401)
				.json({ erro: 'Não existe nem um protuto com esse ID' })
		}

		let path

		if (req.file) {
			path = req.file.filename
		}

		const { name, price, category_id, offer } = req.body

		if (name) {
			const nameExists = await Product.findOne({
				where: { name, id: { [Op.ne]: id } },
			})

			if (nameExists) {
				return res
					.status(400)
					.json({ Erro: 'Já existe um Produto com esse nome cadastrado' })
			}
		}

		await product.update({
			name,
			price,
			category_id,
			path: path || product.path,
			offer,
		})

		return res.status(200).json({ message: 'Produto atualizado' })
	}
}

export default new ProductController()
