import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useSelector, useDispatch } from 'react-redux';
import { removeProductFromCart, updateProductQuantity } from '../../store/cartSlice';

const CartModal = ({ show, handleClose }) => {
    const dispatch = useDispatch();
    const cart = useSelector(state => state.cart.products);

    const renderCartItems = () => {
        return Object.keys(cart).map(key => (
            <div key={key} className="cart-item">
                <p>{cart[key].data.descripcion} - Precio: ${cart[key].data.precio.toFixed(2)}</p>
                <div className="d-flex align-items-center">
                    <Form.Control
                        type="number"
                        value={cart[key].quantity}
                        onChange={(e) => handleQuantityChange(e, key)}
                        min="1"
                        max={cart[key].data.stock}
                    />
                    <Button variant="danger" size="sm" onClick={() => handleRemoveFromCart(key)}>
                        Eliminar
                    </Button>
                </div>
            </div>
        ));
    }

    const handleRemoveFromCart = (productId) => {
        dispatch(removeProductFromCart({ productId }));
    }

    const handleQuantityChange = (e, productId) => {
        const newQuantity = parseInt(e.target.value);
        
        console.log('Producto:', cart[productId]);
        console.log('Stock:', cart[productId].data.stock);
    
        // Validar que la nueva cantidad esté dentro de los límites del stock disponible
        if (newQuantity > 0 && newQuantity <= cart[productId].data.stock) {
            dispatch(updateProductQuantity({ productId, newQuantity }));
        } else if (newQuantity <= 0) {
            dispatch(removeProductFromCart({ productId }));
        } else {
            console.error('Cantidad no válida');
        }
    }
    

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Carrito de Compras</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {Object.keys(cart).length > 0 ? renderCartItems() : <p>El carrito está vacío.</p>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                <Button variant="primary" onClick={() => alert('Proceder a pagar')}>
                    Proceder a pagar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CartModal;