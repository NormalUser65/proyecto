// SlaService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'sla';

class SlaService {
  // GET /sla
  getAll() {
    return axios.get(BASE_URL);
  }

  // GET /sla/{id}
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // GET /sla/nombre/{nombre}
  getByNombre(nombre) {
    return axios.get(`${BASE_URL}/nombre/${nombre}`);
  }
}

export default new SlaService();
