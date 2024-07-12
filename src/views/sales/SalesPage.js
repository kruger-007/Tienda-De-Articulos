import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderService from '../../services/OrderService';
import { Table, Form, InputGroup, Button} from 'react-bootstrap';
import './SalesPage.css';

const SalesPage = () => {
    const [search, setSearch] = useState('');
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

    useEffect(() => {
        OrderService.getOrders()
            .then(data => {
                setOrders(data);
                setFilteredOrders(data);
            })
            .catch(error => console.error('Error fetching orders:', error));
    }, []);

    const handleSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
    
        setSearch(searchTerm);
        
        if (!searchTerm || searchTerm.trim() === '') {
            setFilteredOrders(orders);
        } else {
            const filtered = filteredOrders.filter(order =>
                order.ordenId.toString().includes(searchTerm) ||
                order.ordenFecha.includes(searchTerm) ||
                order.nombreD.toLowerCase().includes(searchTerm) ||
                order.direccionD.toLowerCase().includes(searchTerm)
            );
            setFilteredOrders(filtered);
        }
    };
    


    const sortOrders = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = null;
        }

        setSortConfig({ key, direction });

        if (direction) {
            const sortedOrders = [...filteredOrders].sort((a, b) => {
                if (a[key] < b[key]) {
                    return direction === 'ascending' ? -1 : 1;
                }
                if (a[key] > b[key]) {
                    return direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
            filteredOrders(sortedOrders);
        } else {
            OrderService.getOrders()
                .then(data => filteredOrders(data))
                .catch(error => console.error('Error fetching orders:', error));
        }
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '↑' : sortConfig.direction === 'descending' ? '↓' : '';
        }
        return '';
    };
    

    const updateOrderStatus = async (orderId, newStatus) => {
        const url = `${process.env.REACT_APP_PRODUCTS_API_URL}Orden/${orderId}`;
        try {
            const response = await axios.put(url, {
                ordenId: orderId,
                clienteId: filteredOrders.find(order => order.ordenId === orderId)?.clienteId,
                ordenFecha: filteredOrders.find(order => order.ordenId === orderId)?.ordenFecha,
                nombreD: filteredOrders.find(order => order.ordenId === orderId)?.nombreD,
                direccionD: filteredOrders.find(order => order.ordenId === orderId)?.direccionD,
                estadoId: newStatus
            });
            if (response.status) {
                const updatedOrders = filteredOrders.map(order => {
                    if (order.ordenId === orderId) {
                        return { ...order, estadoId: newStatus };
                    }
                    return order;
                });
                setFilteredOrders(updatedOrders);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };
    

    const getStatusText = (estadoId) => {
        return estadoId === 1 ? 'En proceso' : estadoId === 2 ? 'Enviado' : 'Desconocido';
    };

    const handleStatusChange = (orderId, currentStatus) => {
        if (currentStatus === 1) {
            updateOrderStatus(orderId, 2); 
        } else if (currentStatus === 2) {
            updateOrderStatus(orderId, 1); 
        }
    };

    return (
        <div className="container mt-4">
            <h1>Órdenes de Ventas</h1>
            <InputGroup className="mb-3">
                <Form.Control
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Buscar por número de orden, fecha o etc"
                />
            </InputGroup>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th onClick={() => sortOrders('ordenFecha')}>Fecha {getSortIndicator('ordenFecha')}</th>
                        <th>Número de Orden</th>
                        <th>ID del Cliente</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th onClick={() => sortOrders('estadoId')}>Estado de la Orden {getSortIndicator('estadoId')}</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.length > 0 ? (
                        filteredOrders.map(order => (
                            <tr key={order.ordenId}>
                                <td>{order.ordenFecha}</td>
                                <td>{order.ordenId}</td>
                                <td>{order.clienteId}</td>
                                <td>{order.nombreD}</td>
                                <td>{order.direccionD}</td>
                                <td>{getStatusText(order.estadoId)}</td>
                                <td>
                                {order.estadoId === 1 ? (
                                    <Button variant="success" onClick={() => handleStatusChange(order.ordenId, order.estadoId)}>Enviar</Button>
                                ) : order.estadoId === 2 ? (
                                    <Button variant="success" onClick={() => handleStatusChange(order.ordenId, order.estadoId)}>Enviado</Button>
                                ) : null}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7}>No se encontraron órdenes que coincidan con la búsqueda.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default SalesPage;
