// src/Servicios/PrioridadService.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "prioridades";

class PrioridadService {
  getAll() {
    return axios.get(BASE_URL);
  }

  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }
}

export default new PrioridadService();