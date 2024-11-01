import * as Yup from 'yup'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import token from '../../config/token'

class LoginController {
	async store(req, res) {
		const schema = Yup.object().shape({
			email: Yup.string().required(),
			password: Yup.string().required(),
		})

		if (!(await schema.isValid(req.body))) {
			return res.status(401).json({ Erro: 'Email ou password incorreto' })
		}
		const { email, password } = req.body

		const user = await User.findOne({
			where: { email },
		})

		if (!user) {
			return res.status(401).json({ Erro: 'Email ou password incorreto' })
		}

		if (!(await user.checkPassword(password))) {
			return res.status(401).json({ Erro: 'Email ou password incorreto' })
		}
		return res.json({
			id: user.id,
			email,
			name: user.name,
			admin: user.admin,
			Token: jwt.sign({ id: user.id, name: user.name }, token.secret, {
				expiresIn: token.expiresIn,
			}),
		})
	}
}

export default new LoginController()
