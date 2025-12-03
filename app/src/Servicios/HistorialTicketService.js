
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'historiales';

class HistorialTicketService {
  // Actualizar estado del ticket y registrar historial
  actualizarEstado(payload) {
    return axios.post(`${BASE_URL}/actualizarEstado`, payload, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Obtener historial cronológico por ticket
  obtenerHistorial(ticketId) {
    return axios.get(`${BASE_URL}/${ticketId}`);
  }
}

export default new HistorialTicketService();
