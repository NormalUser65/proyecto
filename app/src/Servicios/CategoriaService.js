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
   // POST /categorias → Crear categoría
  crearCategoria(categoria) {
    return axios.post(BASE_URL, JSON.stringify(categoria), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // PUT /categorias → Actualizar categoría
  actualizarCategoria(categoria) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(categoria),
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export default new CategoriaService();
