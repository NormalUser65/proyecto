import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'user';

class UsuarioService {
    getUsers() {
        return axios.get(BASE_URL);
    }
    getUserById(IDUsuario) {
        return axios.get(BASE_URL + '/' + IDUsuario);
    }
    getAllCustomer() {
        return axios.get(BASE_URL + '/allCustomer/');
    }
    getCustomerbyShopRental(ShopRentalId) {
        return axios.get(BASE_URL + '/customerbyShopRental/'+ ShopRentalId);
    }
    createUser(User) {
        return axios.post(BASE_URL, JSON.stringify(User));
    }
    loginUser(User) {
        return axios.post(BASE_URL + '/login/', JSON.stringify(User));
    }
}

export default new UsuarioService();