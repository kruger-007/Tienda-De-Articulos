import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FaTrash } from 'react-icons/fa'
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';


const DeleteProduct = ({ id }) => {

    const [show, setShow] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    const deleteProduct = () => {
        if (id) {
            const url = `${process.env.REACT_APP_PRODUCTS_API_URL}Producto/${id}`;
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
                    console.error('Error deleting product:', error);
                });
        }
    };

    return (
        <>
            <Button variant="danger" onClick={handleShow}>
                <FaTrash />
            </Button>
            <Modal centered show={show} onHide={handleClose} size="sm">
                <Modal.Header closeButton>
                    <Modal.Title
                        id="example-modal-sizes-title-sm">
                        Eliminar producto
                    </Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={deleteProduct}>
                        Borrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeleteProduct;