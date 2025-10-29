// CategoriaService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'categorias';

class CategoriaService {
  // GET /categorias
  getAll() {
    return axios.get(BASE_URL);
  }

  // GET /categorias/{id}
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // GET /categorias/detalle/{id}
  getDetalle(id) {
    return axios.get(`${BASE_URL}/detalle/${id}`);
  }

  // GET /categorias/nombre/{nombre}
  getByNombre(nombre) {
    return axios.get(`${BASE_URL}/nombre/${nombre}`);
  }
}

export default new CategoriaService();
