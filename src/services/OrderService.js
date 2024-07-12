import axios from 'axios';

const API_URL = process.env.REACT_APP_PRODUCTS_API_URL;

const getOrders = async () => {
    const response = await axios.get(`${API_URL}Orden`);
    return response.data;
};

const OrderService = {
    getOrders
};

export default OrderService;
