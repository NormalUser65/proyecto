// AsignacionService.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "asignaciones";

class AsignacionService {
  getAll() {
    return axios.get(BASE_URL);
  }

  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // GET /asignacion/tecnico/{id}
  getTicketsByTecnico(id) {
    return axios.get(`${BASE_URL}/tecnico/${id}`);
  }

  // GET /asignacion/ticket/{id}
  getTicketsByTicketId(id) {
    return axios.get(`${BASE_URL}/ticket/${id}`);
  }

  // GET /asignacion/obtener-ticket/{id}
  obtenerTicket(id) {
    return axios.get(`${BASE_URL}/obtener-ticket/${id}`);
  }

  // GET /asignacion/obtener-tecnico/{id}
  obtenerTecnico(id) {
    return axios.get(`${BASE_URL}/obtener-tecnico/${id}`);
  }

  // GET /asignacion/nombre/{nombre}
  getByNombre(nombre) {
    return axios.get(`${BASE_URL}/nombre/${nombre}`);
  }

  getDetalle(id) {
    return axios.get(`${BASE_URL}/detalle/${id}`);
  }

  // GET /asignaciones/asignarManual
  asignarManual(formData) {
    return axios.post(`${BASE_URL}/asignarManual`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  asignarAutomatico() {
    return axios.get(`${BASE_URL}/asignarAutomatico`);
  }

  // GET /asignaciones/pendientes
  getTicketsPendientes() {
    return axios.get(`${BASE_URL}/pendientes`);
  }
}

export default new AsignacionService();
