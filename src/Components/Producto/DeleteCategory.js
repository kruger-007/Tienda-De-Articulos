import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaTrash } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const DeleteCategory = ({ id }) => {
    const [show, setShow] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const deleteCategory = () => {
        if (id) {
            const url = `${process.env.REACT_APP_PRODUCTS_API_URL}Categoria/${id}`;
            axios.delete(url)
                .then((response) => {
                    if (response.status === 204) {
                        handleClose();
                        const params = new URLSearchParams(searchParams);
                        params.set('refresh', true);
                        setSearchParams(params);
                    }
                })
                .catch((error) => {
                    console.error('Error deleting category:', error);
                });
        }
    };

    return (
        <>
            <Button variant="danger" onClick={handleShow}>
                <FaTrash />
            </Button>
            {show && (
                <Modal centered show={show} onHide={handleClose} size="sm">
                    <Modal.Header closeButton>
                        <Modal.Title>Eliminar Categoria</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>¿Estás seguro de que deseas eliminar esta categoría?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Cerrar
                        </Button>
                        <Button variant="danger" onClick={deleteCategory}>
                            Eliminar
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

export default DeleteCategory;