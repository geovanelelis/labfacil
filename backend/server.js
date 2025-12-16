const express = require('express')
const cors = require('cors')
require('dotenv').config()
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors())
app.use(express.json())

// Rota de teste
app.get('/', (req, res) => {
  res.send('API LabFácil Online!')
})

// Buscar todos os laboratórios
app.get('/laboratorios', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM LABORATORIO ORDER BY NOME')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar laboratórios' })
  }
})

// Buscar todas as reservas
app.get('/reservas', async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 
        R.CODIGO as codigo,
        R.DATA_HORA_INICIO as data_hora_inicio, 
        R.DATA_HORA_FIM as data_hora_fim,
        R.CPF_PROFESSOR as cpf_professor,
        R.COD_DISCIPLINA as cod_disciplina,
        R.COD_TURMA as cod_turma,
        R.COD_LABORATORIO as cod_laboratorio,
        R.STATUS as status, 
        P.NOME AS professor_nome, 
        D.NOME AS disciplina_nome,
        T.NOME AS turma_nome,
        L.NOME AS laboratorio_nome
      FROM RESERVA R
      JOIN PROFESSOR P ON R.CPF_PROFESSOR = P.CPF
      JOIN DISCIPLINA D ON R.COD_DISCIPLINA = D.CODIGO
      JOIN TURMA T ON R.COD_TURMA = T.CODIGO
      JOIN LABORATORIO L ON R.COD_LABORATORIO = L.CODIGO
      ORDER BY R.DATA_HORA_INICIO DESC
    `)
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar reservas' })
  }
})

// Criar Nova Reserva
app.post('/reservas', async (req, res) => {
  const {
    data_hora_inicio,
    data_hora_fim,
    cpf_professor,
    cod_disciplina,
    cod_turma,
    cod_laboratorio,
  } = req.body
  try {
    const query = `
      INSERT INTO RESERVA (DATA_HORA_INICIO, DATA_HORA_FIM, CPF_PROFESSOR, COD_DISCIPLINA, COD_TURMA, COD_LABORATORIO)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `
    const values = [
      data_hora_inicio,
      data_hora_fim,
      cpf_professor,
      cod_disciplina,
      cod_turma,
      cod_laboratorio,
    ]
    const { rows } = await db.query(query, values)
    res.status(201).json(rows[0])
  } catch (err) {
    console.error('Erro na criação da reserva:', err.message, err.code)

    // Tratamento específico para erros do Trigger
    if (err.code === 'P0001') {
      res.status(400).json({
        error: err.message.replace('ERROR:', '').trim(),
      })
    }
    // Resposta genérica para demais erros
    res.status(500).json({ error: 'Falha interna ao criar reserva.' })
  }
})

// Buscar professores
app.get('/professores', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM PROFESSOR ORDER BY NOME')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar professores' })
  }
})

// Buscar turmas
app.get('/turmas', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM TURMA ORDER BY NOME')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar turmas' })
  }
})

// Buscar disciplinas
app.get('/disciplinas', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM DISCIPLINA ORDER BY NOME')
    res.json(rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao buscar disciplinas' })
  }
})

// Cancelar reserva
app.put('/reservas/:codigo/cancelar', async (req, res) => {
  const { codigo } = req.params
  try {
    const query = `
      UPDATE RESERVA
      SET STATUS = 'CANCELADO'
      WHERE CODIGO = $1
      RETURNING *
    `
    const values = [codigo]
    const { rows } = await db.query(query, values)
    res.json(rows[0])
  } catch (err) {
    console.error('Erro ao cancelar reserva:', err.message, err.code)
    if (err.code === 'P0001') {
      res.status(400).json({
        error: err.message.replace('ERROR:', '').trim(),
      })
    }
    res.status(500).json({ error: 'Falha interna cancelar reserva' })
  }
})

// Atualizar reserva
app.put('/reservas/:codigo', async (req, res) => {
  const { codigo } = req.params
  const {
    data_hora_inicio,
    data_hora_fim,
    cpf_professor,
    cod_disciplina,
    cod_turma,
    cod_laboratorio,
  } = req.body

  try {
    const query = `
      UPDATE RESERVA
      SET 
        DATA_HORA_INICIO = $1,
        DATA_HORA_FIM = $2,
        CPF_PROFESSOR = $3,
        COD_DISCIPLINA = $4,
        COD_TURMA = $5,
        COD_LABORATORIO = $6
      WHERE CODIGO = $7
      RETURNING *
    `
    const values = [
      data_hora_inicio,
      data_hora_fim,
      cpf_professor,
      cod_disciplina,
      cod_turma,
      cod_laboratorio,
      codigo,
    ]
    const { rows } = await db.query(query, values)
    res.json(rows[0])
  } catch (err) {
    console.error('Erro ao atualizar reserva:', err.message, err.code)
    if (err.code === 'P0001') {
      res.status(400).json({
        error: err.message.replace('ERROR:', '').trim(),
      })
    }
    res.status(500).json({ error: 'Falha interna ao atualizar reserva' })
  }
})

// Excluir reserva
app.delete('/reservas/:codigo', async (req, res) => {
  const { codigo } = req.params
  try {
    const query = 'DELETE FROM RESERVA WHERE CODIGO = $1 RETURNING CODIGO'
    const values = [codigo]
    const { rows } = await db.query(query, values)

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Reserva não encontrada' })
    }

    res.json({ message: 'Reserva excluída com sucesso', codigo: rows[0].codigo })
  } catch (err) {
    console.error('Erro ao excluir reserva:', err.message, err.code)
    res.status(500).json({ error: 'Falha interna ao excluir reserva' })
  }
})

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
