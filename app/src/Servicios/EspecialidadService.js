// EspecialidadesService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'EspecialidadesController';

class EspecialidadesService {
  // GET /especialidad
  getAll() {
    return axios.get(BASE_URL);
  }

  // GET /especialidad/tecnico/{id}
  getByTecnico(id) {
    return axios.get(`${BASE_URL}/tecnico/${id}`);
  }

  // GET /especialidad/nombre/{nombre}
  getByNombre(nombre) {
    return axios.get(`${BASE_URL}/nombre/${nombre}`);
  }
}

export default new EspecialidadesService();
