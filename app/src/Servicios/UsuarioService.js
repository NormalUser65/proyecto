// UsuarioService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'Usuario';

class UsuarioService {
  getAllUsuarios() {
    return axios.get(BASE_URL);
  }

  ObtenerTecnicos() {
    return axios.get(`${BASE_URL}/ListaTecnicos`);
  }

  obtenerUsuarioPorId(id) {
    return axios.get(`${BASE_URL}/ListaDetalleTecnicos/${id}`);
  }
}

export default new UsuarioService();
