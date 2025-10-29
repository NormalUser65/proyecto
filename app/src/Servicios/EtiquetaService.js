// EtiquetaService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'etiqueta';

class EtiquetaService {
  // GET /etiqueta
  getAll() {
    return axios.get(BASE_URL);
  }

  // GET /etiqueta/{id}
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // GET /etiqueta/nombre/{nombre}
  getByNombre(nombre) {
    return axios.get(`${BASE_URL}/nombre/${nombre}`);
  }
}

export default new EtiquetaService();
