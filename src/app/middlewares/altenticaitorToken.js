import jwt from 'jsonwebtoken'
import configToken from '../../config/token'

export default (req, res, next) => {
	const bearerToken = req.headers.authorization

	if (!bearerToken) {
		res.status(401).json({ erro: 'Token não encotrado' })
	}

	const token = bearerToken.split(' ')[1]
	try {
		jwt.verify(token, configToken.secret, function (erro, decode) {
			if (erro) {
				throw new Error()
			}
			req.userId = decode.id
			req.userName = decode.name
			return next()
		})
	} catch (error) {
		return res.status(401).json({ error: 'token é invalido' })
	}
}
