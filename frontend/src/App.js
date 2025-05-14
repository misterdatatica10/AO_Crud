import React, { useEffect, useState } from 'react';
import './App.css';

// url da api
const API_URL = `${process.env.REACT_APP_API_URL}/api/items`;

function App() {
  // estados
  const [jogadores, setJogadores] = useState([]);
  const [form, setForm] = useState({
    name: '',
    position: '',
    team: '',
    age: '',
    nationality: '',
    goals: 0,
    assists: 0
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // buscar jogadores
  useEffect(() => {
    const fetchJogadores = async () => {
      try {
        console.log('Iniciando busca de jogadores...');
        setLoading(true);
        setError(null);
        const res = await fetch(API_URL);
        console.log('Status da resposta:', res.status);
        if (!res.ok) {
          throw new Error(`Erro no servidor! Código: ${res.status}`);
        }
        const data = await res.json();
        console.log('Jogadores recebidos:', data.length);
        setJogadores(data);
      } catch (error) {
        console.error('Erro ao buscar jogadores:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJogadores();
  }, []);

  // mudar valores do form
  const handleChange = e => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // guardar jogador
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        console.log('Iniciando atualização do jogador:', editingId);
        // atualizar
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        console.log('Status da atualização:', res.status);
        if (res.ok) {
          const updated = await res.json();
          console.log('Jogador atualizado:', updated);
          setJogadores(jogadores.map(jogador => jogador._id === editingId ? updated : jogador));
          setEditingId(null);
          setForm({
            name: '',
            position: '',
            team: '',
            age: '',
            nationality: '',
            goals: 0,
            assists: 0
          });
        } else {
          throw new Error(`Erro ao atualizar: ${res.status}`);
        }
      } else {
        console.log('Iniciando criação de novo jogador:', form);
        // criar novo
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        console.log('Status da criação:', res.status);
        if (res.ok) {
          const newJogador = await res.json();
          console.log('Novo jogador criado:', newJogador);
          setJogadores([...jogadores, newJogador]);
          setForm({
            name: '',
            position: '',
            team: '',
            age: '',
            nationality: '',
            goals: 0,
            assists: 0
          });
        } else {
          throw new Error(`Erro ao criar: ${res.status}`);
        }
      }
    } catch (error) {
      console.error('Erro ao guardar jogador:', error);
      setError(`Erro ao guardar jogador: ${error.message}`);
    }
  };

  // editar jogador
  const handleEdit = jogador => {
    setEditingId(jogador._id);
    setForm({
      name: jogador.name,
      position: jogador.position,
      team: jogador.team,
      age: jogador.age,
      nationality: jogador.nationality,
      goals: jogador.goals,
      assists: jogador.assists
    });
  };

  // apagar jogador
  const handleDelete = async id => {
    try {
      console.log('Iniciando exclusão do jogador:', id);
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      console.log('Status da exclusão:', res.status);
      if (res.ok) {
        console.log('Jogador excluído com sucesso');
        setJogadores(jogadores.filter(jogador => jogador._id !== id));
      } else {
        throw new Error(`Erro ao excluir: ${res.status}`);
      }
    } catch (error) {
      console.error('Erro ao apagar jogador:', error);
      setError(`Erro ao apagar jogador: ${error.message}`);
    }
  };

  return (
    <div className="App">
      <h1>Lista de Jogadores</h1>
      <h2>Adicione, atualize e elimine jogadores de futebol.</h2>
      
      {error && <div className="error-message">Erro: {error}</div>}
      {loading && <div className="loading">A carregar...</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="Formulario">
          <div>
            <label htmlFor="name">Nome do Jogador</label>
            <input
              id="name"
              name="name"
              placeholder="Ex: Cristiano Ronaldo"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="position">Posição no Campo</label>
            <input
              id="position"
              name="position"
              placeholder="Ex: Avançado, Médio, Defesa"
              value={form.position}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="team">Clube Atual</label>
            <input
              id="team"
              name="team"
              placeholder="Ex: Benfica, Porto, Sporting"
              value={form.team}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="age">Idade do Jogador</label>
            <input
              id="age"
              name="age"
              type="number"
              placeholder="Ex: 25"
              value={form.age}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="nationality">Nacionalidade</label>
            <input
              id="nationality"
              name="nationality"
              placeholder="Ex: Portuguesa"
              value={form.nationality}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="goals">Número de Golos Marcados</label>
            <input
              id="goals"
              name="goals"
              type="number"
              placeholder="Ex: 15"
              value={form.goals}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="assists">Número de Assistências</label>
            <input
              id="assists"
              name="assists"
              type="number"
              placeholder="Ex: 8"
              value={form.assists}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <button className="butaoAdicionar" type="submit">
          {editingId ? 'Atualizar Jogador' : 'Adicionar Jogador'}
        </button>
        
        {editingId && (
          <button
            className="butaoCancelar"
            type="button"
            onClick={() => {
              setEditingId(null);
              setForm({
                name: '',
                position: '',
                team: '',
                age: '',
                nationality: '',
                goals: 0,
                assists: 0
              });
            }}
          >
            Cancelar Edição
          </button>
        )}
      </form>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Posição</th>
              <th>Clube</th>
              <th>Idade</th>
              <th>Nacionalidade</th>
              <th>Golos</th>
              <th>Assistências</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {jogadores.map(jogador => (
              <tr key={jogador._id}>
                <td>{jogador.name}</td>
                <td>{jogador.position}</td>
                <td>{jogador.team}</td>
                <td>{jogador.age}</td>
                <td>{jogador.nationality}</td>
                <td>{jogador.goals}</td>
                <td>{jogador.assists}</td>
                <td>
                  <button onClick={() => handleEdit(jogador)}>Editar</button>
                  <button onClick={() => handleDelete(jogador._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
