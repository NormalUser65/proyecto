// EspecialidadService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'especialidad';

class EspecialidadService {
  // GET /especialidad
  getAll() {
    return axios.get(BASE_URL);
  }

  // GET /especialidad/{id}
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // GET /especialidad/nombre/{nombre}
  getByNombre(nombre) {
    return axios.get(`${BASE_URL}/nombre/${nombre}`);
  }
}

export default new EspecialidadService();
