import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { FaArrowCircleUp } from 'react-icons/fa';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const UpdateCategoryDialog = ({ category, onUpdate }) => {
    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState({
        categoriaId: category.categoriaId,
        descripcion: category.descripcion
    });
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const handleClose = () => {
        setShow(false);
        setError('');
    };

    const handleShow = async () => {
        setShow(true);
        try {
            const url = `${process.env.REACT_APP_PRODUCTS_API_URL}Categoria`;
            await axios.get(url);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Error fetching categories. Please try again later.');
        }
    };    

    const onInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const updateCategory = async () => {
        const url = `${process.env.REACT_APP_PRODUCTS_API_URL}Categoria/${category.categoriaId}`;
        try {
            const response = await axios.put(url, {
                categoriaId: formData.categoriaId,
                descripcion: formData.descripcion
            });
            if (response.status === 204) {
                handleClose();
                const params = new URLSearchParams(searchParams);
                params.set('refresh', true);
                setSearchParams(params);
                onUpdate(category.categoriaId, formData);
            }
        } catch (error) {
            if (error?.response?.status === 400) {
                setError(error.response.data.title);
            } else {
                setError('Error inesperado al actualizar la categoría.');
            }
            console.error('Error updating the category:', error);
        }
    };    

    return (
        <>
            <Button variant="warning" onClick={handleShow}>
                <FaArrowCircleUp />
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar Categoría</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoría ID</Form.Label>
                            <Form.Control
                                name="categoriaId"
                                type="text"
                                value={formData.categoriaId}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                name="descripcion"
                                type="text"
                                value={formData.descripcion}
                                onChange={onInputChange}
                            />
                        </Form.Group>
                    </Form>
                    {error && <p className="text-danger">{error}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={updateCategory}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
                {error && <Alert variant="danger">{error}</Alert>}
            </Modal>
        </>
    );
};

export default UpdateCategoryDialog;