const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const itemsRouter = require('./routes/items');

const app = express();

// configuração do cors para o frontend
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// para poder usar json
app.use(express.json());

// ligar à base de dados
mongoose.connect('mongodb://localhost:27017/football-players', {
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

// iniciar o servidor
const PORT = 3001;
app.listen(PORT, 'localhost', () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
}); 