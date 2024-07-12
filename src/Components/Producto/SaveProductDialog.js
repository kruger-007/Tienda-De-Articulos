import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { FaPlus } from 'react-icons/fa';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const SaveProductDialog = () => {
    const defaultFormState = {
        categoriaId: 0,
        descripcion: '',
        talla: '',
        marca: '',
        precio: 0,
        imagen: '',
        stock: 0
    };

    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState(defaultFormState);
    const [error, setError] = useState('')
    const [searchParams, setSearchParams] = useSearchParams();

    const [categories, setCategories] = useState([]);

    const handleClose = () => {
        setShow(false);
        setFormData(defaultFormState);
        setError('');
    };


    const handleShow = async () => {
        setShow(true);
        try {
            const url = `${process.env.REACT_APP_PRODUCTS_API_URL}Categoria`;
            const response = await axios.get(url);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Error fetching categories. Please try again later.');
        }
    };

    const onInputChange = (event) => {
        const key = event.target.name;
        const value = event.target.value;
        setFormData({ ...formData, [key]: value });
    };

    const createProduct = () => {
        const url = `${process.env.REACT_APP_PRODUCTS_API_URL}Producto`;
        axios.post(url, {
            categoriaId: formData.categoriaId,
            descripcion: formData.descripcion,
            talla: formData.talla,
            marca: formData.marca,
            precio: formData.precio,
            imagen: formData.imagen,
            stock: formData.stock
        }).then((response) => {
            if (response.status === 201) {
                handleClose();
                const params = new URLSearchParams(searchParams);
                params.set('refresh', true);
                setSearchParams(params);
            }
        }).catch((error) => {
            if (error?.response?.status === 400) {
                setError(error.response.data.title);
            } else {
                setError('Error inesperado al crear el producto.');
            }
            console.error('Error creating product:', error);
        });
    };

    /*const onSaveProduct = async () => {
        if (!validateForm()) {
            setError('Please fill out all required fields correctly.');
            return;
        }

        try {
            const response = await axios.post('https://localhost:7074/Producto', formData);
            if (response.status === 201) {
                handleClose();
            } else {
                setError('Failed to save product.');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            setError('Error saving product. Please try again later.');
        }
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
                    <Modal.Title>New Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Categoria</Form.Label>
                            <Form.Select
                                name="categoriaId"
                                value={formData.categoriaId}
                                onChange={onInputChange}
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map((category) => (
                                    <option key={category.categoriaId} value={category.categoriaId}>
                                        {category.descripcion}
                                    </option>
                                ))}
                            </Form.Select>
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
                        <Form.Group className="mb-3">
                            <Form.Label>Talla</Form.Label>
                            <Form.Control
                                name="talla"
                                type="text"
                                value={formData.talla}
                                onChange={onInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Marca</Form.Label>
                            <Form.Control
                                name="marca"
                                type="text"
                                value={formData.marca}
                                onChange={onInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                name="precio"
                                type="number"
                                value={formData.precio}
                                onChange={onInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control
                                name="imagen"
                                type="text"
                                value={formData.imagen}
                                onChange={onInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                name="stock"
                                type="number"
                                value={formData.stock}
                                onChange={onInputChange}
                            />
                        </Form.Group>
                    </Form>
                    {error && <p className="text-danger">{error}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={createProduct}>
                        Save
                    </Button>
                </Modal.Footer>
                {error && <Alert variant={"danger"}>{error}</Alert>}
            </Modal>
        </>
    );
};

export default SaveProductDialog;