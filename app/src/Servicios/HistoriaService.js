// HistorialService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'historial';

class HistorialService {
  // GET /historial
  getAll() {
    return axios.get(BASE_URL);
  }

  // GET /historial/{id}
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // GET /historial/nombre/{nombre}
  getByNombre(nombre) {
    return axios.get(`${BASE_URL}/nombre/${nombre}`);
  }
}

export default new HistorialService();
