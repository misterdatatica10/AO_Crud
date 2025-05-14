import React, { useEffect, useState } from 'react';
import './App.css';

// url da api
const API_URL = 'http://localhost:3001/api/items';

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
        setLoading(true);
        setError(null);
        const res = await fetch(API_URL);
        if (!res.ok) {
          throw new Error(`Erro no servidor! Código: ${res.status}`);
        }
        const data = await res.json();
        setJogadores(data);
      } catch (error) {
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
        // atualizar
        const res = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const updated = await res.json();
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
        }
      } else {
        // criar novo
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        if (res.ok) {
          const newJogador = await res.json();
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
        }
      }
    } catch (error) {
      setError('Erro ao guardar jogador');
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
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setJogadores(jogadores.filter(jogador => jogador._id !== id));
      }
    } catch (error) {
      setError('Erro ao apagar jogador');
    }
  };

  return (
    <div className="App" style={{ maxWidth: 1250, margin: '2rem auto', fontFamily: 'Segoe UI' }}>
      <h1>Lista de Jogadores</h1>
      <h2>Adicione, atualize e elimine jogadores de futebol.</h2>
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Erro: {error}</div>}
      {loading && <div>A carregar...</div>}
      
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: 'grid', gap: '1rem' }}>
        <div className="Formulario" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem 4.5rem', padding: '2rem 4rem 3rem 4rem', backgroundColor: '#f5f5f5' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
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
        <button className="butaoAdicionar" type="submit" style={{ padding: '1.7rem', marginTop: '10px' }}>
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
            style={{ padding: '1.7rem' }}
          >
            Cancelar Edição
          </button>
        )}
      </form>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                  <button onClick={() => handleEdit(jogador)}>Editar</button>{' '}
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
