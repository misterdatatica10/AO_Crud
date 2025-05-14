const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const itemsRouter = require('./routes/items');
require('dotenv').config();  // Importar as variáveis de ambiente

const app = express();

// Configuração do CORS para o frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',  // Pega a URL do frontend a partir da variável de ambiente
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Para poder usar JSON
app.use(express.json());

// Conectar à base de dados (MongoDB Atlas)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Base de dados conectada com sucesso!'))
.catch(err => console.error('Erro ao conectar à base de dados:', err));

// Usar as rotas
app.use('/api/items', itemsRouter);

// Rota de teste
app.get('/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001;  // Definir a porta a partir da variável de ambiente ou 3001 como padrão
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
