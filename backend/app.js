const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const itemsRouter = require('./routes/items');

const app = express();

// configuração do cors para o frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// para poder usar json
app.use(express.json());

// Ligar à base de dados utilizando a variável de ambiente
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Base de dados ligada!'))
.catch(err => console.error('Erro na base de dados:', err));

// usar as rotas
app.use('/api/items', itemsRouter);

// rota de teste
app.get('/test', (req, res) => {
  res.json({ message: 'API a funcionar!' });
});

/* iniciar o servidor localmente
const PORT = 3001;
app.listen(PORT, 'localhost', () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});  */

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});