const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const itemsRouter = require('./routes/items');
require('dotenv').config();  // Carregar as variáveis de ambiente

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
.then(() => {
  console.log('Base de dados conectada com sucesso!');
})
.catch(err => {
  console.error('Erro ao conectar à base de dados:', err);
  console.error('Detalhes do erro:', err.stack);  // Mostrar detalhes do erro (stack trace)
});

// Usar as rotas
app.use('/api/items', itemsRouter);

// Rota raiz para evitar "URL desconhecida"
app.get('/', (req, res) => {
  res.send('API do CRUD está funcionando!');
});

// Rota de teste
app.get('/test', (req, res) => {
  console.log('Requisição recebida na rota /test');
  res.json({ message: 'API funcionando!' });
});

// Rota padrão para captura de erros 404
app.use((req, res) => {
  console.log(`Requisição para URL desconhecida: ${req.originalUrl} ${req.method} ${req.url}`);
  res.status(404).send('Página não encontrada');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3001;  // Definir a porta a partir da variável de ambiente ou 3001 como padrão
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});