// ClientNavBar.js
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { FaShoppingCart } from 'react-icons/fa';
import CartModal from '../../Components/Producto/CartModal';
import { useSelector } from 'react-redux';
import './ClientNavBar.css'

const ClientNavBar = () => {
    const [show, setShow] = useState(false);
    const cart = useSelector(state => state.cart.products);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand>Innova</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                        </Nav>
                        <Nav>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link onClick={handleShow}>
                                <FaShoppingCart size={20} />
                                {/* Mostrar el conteo del carrito si hay productos */}
                                {Object.keys(cart).length > 0 && (
                                    <span className="cart-count">{Object.keys(cart).length}</span>
                                )}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* Incluir el componente CartModal */}
            <CartModal show={show} handleClose={handleClose} />
        </div>
    );
}

export default ClientNavBar;