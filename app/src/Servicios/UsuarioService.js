// UsuarioService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'Usuario';

class UsuarioService {
  // GET /Usuario
  getAllUsuarios() {
    return axios.get(BASE_URL);
  }

  // GET /Usuario/tecnicos (asumiendo que la ruta es /Usuario/tecnicos)
  getTecnicos() {
    return axios.get(`${BASE_URL}/tecnicos`);
  }

  // GET /Usuario/{id}
  getUsuarioById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }
}

export default new UsuarioService();
