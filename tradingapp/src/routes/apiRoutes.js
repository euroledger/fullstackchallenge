import axios from 'axios';

const apiRoutes = {
    async deposit(depositData) {
        const res = await axios.post('/api/deposit', depositData);
        console.log("deposit res = ", res);
        return res;
    },
    async balance() {
        return await axios.get('/api/balance', null);
    },

    async placeOrder(orderData) {
        return await axios.post('/api/placeorder', orderData);
    }
}

export default apiRoutes;