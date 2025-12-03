// UsuarioService.js
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "Usuario";

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

  obtenerUsuarioPorIdGeneral(id) {
    return axios.get(`${BASE_URL}/obtenerusuarioPorId/${id}`);
  }

  ActualizarTecnico(Tecnico) {
  return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Tecnico),
    });
  }

  CrearTecnico(Tecnico) {
    return axios.post(BASE_URL, JSON.stringify(Tecnico));
  }

  ValEmail(email){
    return axios.get(`${BASE_URL}/ValEmail/${email}`);
  }
  // Nuevo método para técnicos filtrados por categoría
  getTecnicosPorCategoria(categoriaId) {
    return axios.get(`${BASE_URL}/getTecnicosPorCategoria`, {
      params: { categoriaId },
    });
  }
}

export default new UsuarioService();
