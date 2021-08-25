import axios from 'axios';
import orderItems from '../components/Fields/order';

const apiRoutes = {
    async deposit(depositData) {
        const res = await axios.post('/api/deposit', depositData);
        console.log("deposit res = ", res);
        return res;
    },
    async balances() {
        return await axios.get('/api/getbalances', null);
    },

    async placeOrder(orderData) {
        return await axios.post('/api/placeorder', orderData);
    },

    async cancelOpenOrder(id) {
        return await axios.post('/api/cancelorder', id);
    },

    async orders() {
        return await axios.get('/api/getorders', null);
    }
}

export default apiRoutes;