import React, { useEffect, useState } from 'react';
import './App.css';

// url da api
const API_URL = `${process.env.REACT_APP_API_URL}/api/items`;

const emptyForm = {
  name: '',
  position: '',
  team: '',
  age: '',
  nationality: '',
  goals: 0,
  assists: 0
};

function App() {
  // estados
  const [jogadores, setJogadores] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const rowsPerPage = 10;

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
          setForm(emptyForm);
          setShowForm(false);
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
          setForm(emptyForm);
          setShowForm(false);
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
    setForm({
      name: jogador.name,
      position: jogador.position,
      team: jogador.team,
      age: jogador.age,
      nationality: jogador.nationality,
      goals: jogador.goals,
      assists: jogador.assists
    });
    setEditingId(jogador._id);
    setShowForm(true);
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

  // Filtrar jogadores baseado na busca
  const filteredJogadores = jogadores.filter(jogador =>
    jogador.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jogador.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jogador.nationality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular páginas
  const totalPages = Math.ceil(filteredJogadores.length / rowsPerPage);
  const paginatedJogadores = filteredJogadores.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleCancel = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
  };

  return (
    <div className="App">
      <div className="header">
        <h1 className="header-title">Lista de Jogadores</h1>
        <div className="header-actions">
          <button 
            className="action-button btn-primary" 
            onClick={() => {
              setEditingId(null);
              setForm(emptyForm);
              setShowForm(true);
            }}
          >
            Adicionar Jogador
          </button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Pesquisar por nome, clube ou nacionalidade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error && <div className="error-message">Erro: {error}</div>}
      {loading && <div className="loading">A carregar...</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="Formulario">
            <div className="form-group">
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Cristiano Ronaldo"
                required
              />
              <label htmlFor="name">Nome do Jogador</label>
            </div>

            <div className="form-group">
              <input
                id="position"
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Avançado"
                required
              />
              <label htmlFor="position">Posição no Campo</label>
            </div>

            <div className="form-group">
              <input
                id="team"
                name="team"
                value={form.team}
                onChange={handleChange}
                placeholder="Benfica"
                required
              />
              <label htmlFor="team">Clube Atual</label>
            </div>

            <div className="form-group">
              <input
                id="age"
                name="age"
                type="number"
                value={form.age}
                onChange={handleChange}
                placeholder="25"
                required
              />
              <label htmlFor="age">Idade do Jogador</label>
            </div>

            <div className="form-group">
              <input
                id="nationality"
                name="nationality"
                value={form.nationality}
                onChange={handleChange}
                placeholder="Portuguesa"
                required
              />
              <label htmlFor="nationality">Nacionalidade</label>
            </div>

            <div className="form-group">
              <input
                id="goals"
                name="goals"
                type="number"
                value={form.goals}
                onChange={handleChange}
                placeholder="15"
              />
              <label htmlFor="goals">Número de Golos</label>
            </div>

            <div className="form-group">
              <input
                id="assists"
                name="assists"
                type="number"
                value={form.assists}
                onChange={handleChange}
                placeholder="8"
              />
              <label htmlFor="assists">Número de Assistências</label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary">
              {editingId ? 'Atualizar Jogador' : 'Adicionar Jogador'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Jogador</th>
              <th>Posição</th>
              <th>Clube</th>
              <th>Status</th>
              <th>Estatísticas</th>
              <th>Última Atualização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedJogadores.map(jogador => (
              <tr key={jogador._id}>
                <td>
                  <div className="user-cell">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(jogador.name)}&background=random`}
                      alt={jogador.name}
                      className="avatar"
                    />
                    <div className="user-info">
                      <span className="user-name">{jogador.name}</span>
                      <span className="user-role">{jogador.nationality}</span>
                    </div>
                  </div>
                </td>
                <td>{jogador.position}</td>
                <td>{jogador.team}</td>
                <td>
                  <div className="status-indicator">
                    <span className={`status-dot status-active`}></span>
                    Ativo
                  </div>
                </td>
                <td>
                  <div className="rating">
                    <span className="rating-up">▲</span>
                    {jogador.goals} Gols
                    <span className="rating-down">▼</span>
                    {jogador.assists} Assist.
                  </div>
                </td>
                <td>{new Date().toLocaleDateString()}</td>
                <td>
                  <button
                    className="action-button btn-secondary"
                    onClick={() => handleEdit(jogador)}
                  >
                    Editar
                  </button>
                  <button
                    className="action-button btn-secondary"
                    onClick={() => handleDelete(jogador._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span className="pagination-info">
          Mostrando {((currentPage - 1) * rowsPerPage) + 1} a {Math.min(currentPage * rowsPerPage, filteredJogadores.length)} de {filteredJogadores.length} jogadores
        </span>
        <div className="pagination-controls">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ←
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={`pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
