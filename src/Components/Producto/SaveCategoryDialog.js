import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const SaveCategoryDialog = () => {
    const defaultFormState = {
        descripcion: ''
    };

    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState(defaultFormState);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const handleClose = () => {
        setShow(false);
        setFormData(defaultFormState);
        setError('');
    };

    const handleShow = () => setShow(true);

    const onInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const createCategory = () => {
        const url = `${process.env.REACT_APP_PRODUCTS_API_URL}Categoria`;
        axios.post(url, {
            descripcion: formData.descripcion
        })
        .then((response) => {
            if (response.status === 201) {
                handleClose();
                const params = new URLSearchParams(searchParams);
                params.set('refresh', true);
                setSearchParams(params);
            }
        })
        .catch((error) => {
            console.error('Error creating category:', error);
            setError('Error creating category. Please try again later.');
        });
    };

    /*const validateForm = () => {
        return formData.descripcion.trim() !== '';
    };*/

    return (
        <>
            <div className="save-button-wrapper">
                <Button variant="primary" onClick={handleShow}>
                    <FaPlus />
                </Button>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>New Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                name="descripcion"
                                type="text"
                                value={formData.descripcion}
                                onChange={onInputChange}
                            />
                        </Form.Group>
                    </Form>
                    {error && <Alert variant="danger">{error}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                    <Button variant="primary" onClick={createCategory}>
                        Añadir
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default SaveCategoryDialog;