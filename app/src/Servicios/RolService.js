// RolService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'rol';

class RolService {
  // GET /rol
  getAll() {
    return axios.get(BASE_URL);
  }

  // GET /rol/{id}
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // GET /rol/nombre/{nombre}
  getByNombre(nombre) {
    return axios.get(`${BASE_URL}/nombre/${nombre}`);
  }
}

export default new RolService();
