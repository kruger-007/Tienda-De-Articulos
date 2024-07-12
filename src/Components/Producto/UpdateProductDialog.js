import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import { FaArrowCircleUp } from "react-icons/fa";
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const UpdateProductDialog = ({ product, onUpdate }) => {
    const defaultFormState = {
        categoriaId: product.categoriaId,
        descripcion: product.descripcion,
        talla: product.talla,
        marca: product.marca,
        precio: product.precio,
        imagen: product.imagen,
        stock: product.stock
    };

    const [show, setShow] = useState(false);
    const [formData, setFormData] = useState(defaultFormState);
    const [error, setError] = useState('');
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

    const updateProduct = async () => {
        const url = `${process.env.REACT_APP_PRODUCTS_API_URL}Producto/${product.productoId}`;
        try {
            const response = await axios.put(url, {
                productoId: product.productoId,
                categoriaId: formData.categoriaId,
                descripcion: formData.descripcion,
                talla: formData.talla,
                marca: formData.marca,
                precio: formData.precio,
                imagen: formData.imagen,
                stock: formData.stock
            });
            if (response.status === 204) {
                handleClose();
                const params = new URLSearchParams(searchParams);
                params.set('refresh', true);
                setSearchParams(params);
                onUpdate(product.productoId, formData);
            }
        } catch (error) {
            if (error?.response?.status === 400) {
                setError(error.response.data.title);
            } else {
                setError('Error inesperado al actualizar el producto.');
            }
            console.error('Error updating the product:', error);
        }
    };

    return (
        <>
            <Button variant="warning" onClick={handleShow}>
                <FaArrowCircleUp></FaArrowCircleUp>
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Actualizar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Producto ID</Form.Label>
                            <Form.Control
                                name="productoId"
                                type="text"
                                value={product.productoId}
                                readOnly
                            />
                        </Form.Group>
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
                    <Button variant="primary" onClick={updateProduct}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
                {error && <Alert variant={"danger"}>{error}</Alert>}
            </Modal>
        </>
    );
};

export default UpdateProductDialog;