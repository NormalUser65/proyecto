import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'user';

class ServicioUsuario {
    /*getUsers() {
        return axios.get(BASE_URL);
    }
    getUserById(IDUsuario) {
        return axios.get(BASE_URL + '/' + IDUsuario);
    }*/
    //lo que está entre // es el método que se está llamando a la clase
    getListaTecnicos() {
        return axios.get(BASE_URL + '/ListaTecnicos/');
    }
    /*getCustomerbyShopRental(ShopRentalId) {
        return axios.get(BASE_URL + '/customerbyShopRental/'+ ShopRentalId);
    }
    createUser(User) {
        return axios.post(BASE_URL, JSON.stringify(User));
    }
    loginUser(User) {
        return axios.post(BASE_URL + '/login/', JSON.stringify(User));
    }*/
}

export default new ServicioUsuario();