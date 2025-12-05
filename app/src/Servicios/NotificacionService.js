// NotificacionService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'notificacion';

class NotificacionService {
  // GET /notificacion
  getAll(id) {
    return axios.get(`${BASE_URL}/all/${id}`);
  }

  // GET /notificacion/{id}
  crearNotificacion(objeto) {
    return axios.post(BASE_URL, JSON.stringify(objeto));
  }
}

export default new NotificacionService();
