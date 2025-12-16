const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
})

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao adquirir cliente do pool', err.stack)
  }
  console.log('Conexão com o banco de dados estabelecida com sucesso')
  release()
})

module.exports = {
  query: (text, params) => pool.query(text, params),
}
