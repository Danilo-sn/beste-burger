/*store => Cadastrar / Adicionar
/*index => listar varios
/*show => listar penas um
/*update => atualizar
/*delete => deletar
*/
import { v4 } from 'uuid'
import * as Yup from 'yup'

import User from '../models/User'

class UserController {
	async store(req, res) {
		const schema = Yup.object().shape({
			name: Yup.string().required(),
			email: Yup.string().email().required(),
			password: Yup.string().required().min(6),
			admin: Yup.boolean(),
		})

		try {
			await schema.validateSync(req.body, { abortEarly: false })
		} catch (error) {
			return res.status(400).json({ error: error.message })
		}

		const { name, email, password, adimin } = req.body

		const emailExists = await User.findOne({
			where: { email },
		})
		if (emailExists) {
			return res.status(409).json({ Erro: 'Email ja existe' })
		}
		const user = {
			id: v4(),
			name,
			email,
			password,
			adimin,
		}
		await User.create(user)
		return res.status(201).json({ id: user.id, name, email, adimin })
	}
}

export default new UserController()
