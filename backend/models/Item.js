const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'tem que ter nome']
  },
  position: {
    type: String,
    required: [true, 'tem que ter posição']
  },
  team: {
    type: String,
    required: [true, 'tem que ter clube']
  },
  age: {
    type: Number,
    required: [true, 'tem que ter idade']
  },
  nationality: {
    type: String,
    required: [true, 'tem que ter nacionalidade']
  },
  goals: {
    type: Number,
    default: 0
  },
  assists: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema); 