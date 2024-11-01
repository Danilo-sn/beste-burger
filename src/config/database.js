module.exports = {
	dialect: 'postgres',
	host: 'localhost',
	username: 'postgres',
	password: 'bestburger',
	database: 'bestburger',
	port: 5432,
	define: {
		timestamps: true,
		underscored: true,
		underscoredAll: true,
	},
}
