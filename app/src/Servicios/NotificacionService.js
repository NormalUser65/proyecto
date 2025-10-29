// NotificacionService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'notificacion';

class NotificacionService {
  // GET /notificacion
  getAll() {
    return axios.get(BASE_URL);
  }

  // GET /notificacion/{id}
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // GET /notificacion/nombre/{nombre}
  getByNombre(nombre) {
    return axios.get(`${BASE_URL}/nombre/${nombre}`);
  }
}

export default new NotificacionService();
