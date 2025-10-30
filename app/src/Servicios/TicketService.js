// TicketService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'tickets';

class TicketService {
  // Listar todos los tickets
  getTickets() {
    return axios.get(BASE_URL);
  }

  // Obtener ticket por ID
  getTicketById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // Obtener tickets por nombre
  getTicketByNombre(nombre) {
    return axios.get(`${BASE_URL}/nombre/${nombre}`);
  }

  // Obtener cantidad de trabajo por técnico
  getCantidadTrabajoTecnico(tecnicoId) {
    return axios.get(`${BASE_URL}/trabajo-tecnico/${tecnicoId}`);
  }

  // Crear nuevo ticket
  createTicket(ticketData) {
    return axios.post(BASE_URL, JSON.stringify(ticketData), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Actualizar ticket
  updateTicket(ticketData) {
    return axios.put(BASE_URL, JSON.stringify(ticketData), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

export default new TicketService();
