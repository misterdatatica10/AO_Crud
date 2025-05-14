const express = require('express');
const router = express.Router();
const Player = require('../models/Item');

// criar
router.post('/', async (req, res) => {
  try {
    const newPlayer = new Player(req.body);
    const savedPlayer = await newPlayer.save();
    res.status(201).json(savedPlayer);
  } catch (err) {
    console.error('erro ao guardar:', err);
    res.status(400).json({ error: 'erro ao guardar o jogador' });
  }
});

// trazer todos
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    console.error('erro ao buscar jogadores:', err);
    res.status(500).json({ error: 'erro ao buscar jogadores' });
  }
});

// um jogador apenas
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ error: 'jogador nao encontrado' });
    res.json(player);
  } catch (err) {
    console.error('erro ao buscar jogador:', err);
    res.status(500).json({ error: 'erro ao buscar jogador' });
  }
});

// atualizar
router.put('/:id', async (req, res) => {
  try {
    const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlayer) return res.status(404).json({ error: 'jogador nao encontrado' });
    res.json(updatedPlayer);
  } catch (err) {
    console.error('erro ao atualizar:', err);
    res.status(400).json({ error: 'erro ao atualizar jogador' });
  }
});

// apagar
router.delete('/:id', async (req, res) => {
  try {
    const deletedPlayer = await Player.findByIdAndDelete(req.params.id);
    if (!deletedPlayer) return res.status(404).json({ error: 'jogador nao encontrado' });
    res.json({ message: 'jogador apagado' });
  } catch (err) {
    console.error('erro ao apagar:', err);
    res.status(500).json({ error: 'erro ao apagar jogador' });
  }
});

module.exports = router; 