// ImagenService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'imagen';

class ImagenService {
  // GET /imagen/movie/{id}
  getImagenPorPelicula(id) {
    return axios.get(`${BASE_URL}/movie/${id}`);
  }

  // POST /imagen
  uploadImagen(formData) {
    return axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': 'multipart/form-data'
      }
    });
  }
}

export default new ImagenService();
