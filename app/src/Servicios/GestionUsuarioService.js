// GestionService.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'gestion';

class GestionService {
  // GET /gestion → lista todos los usuarios
  getAll() {
    return axios.get(BASE_URL);
  }

  // GET /gestion/{id} → obtiene un usuario por ID
  getById(id) {
    return axios.get(`${BASE_URL}/${id}`);
  }

  // GET /gestion/customers → lista solo clientes
  getCustomers() {
    return axios.get(`${BASE_URL}/customers`);
  }

  // GET /gestion/customersByShop/{idShop} → clientes por tienda
  getCustomersByShop(idShop) {
    return axios.get(`${BASE_URL}/customersByShop/${idShop}`);
  }

  // POST /gestion/login → login de usuario
  login(credentials) {
    return axios.post(`${BASE_URL}/login`, JSON.stringify(credentials), {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // POST /gestion → crear usuario
  create(user) {
    return axios.post(BASE_URL, JSON.stringify(user), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export default new GestionService();
