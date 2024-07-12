import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './LoginForm.css';
import Alert from 'react-bootstrap/Alert';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logIn } from '../../store/AuthSlice';
import axios from 'axios';

const LoginForm = () => {
    const defaultState = {
        nombreUsuario: '',
        password: '',
    }

    const [formData, setFormData] = useState(defaultState);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onInputChange = (event) => {
        const key = event.target.name;
        const value = event.target.value;
        setFormData({...formData, [key]: value});
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_PRODUCTS_API_URL}Usuario/Authenticate`, {
                nombreUsuario: formData.nombreUsuario,
                contrasenna: formData.password,
            });
            const role = response.data.rolId === 1 ? 'admin' : response.data.rolId === 2 ? 'sales' : 'client';
            dispatch(logIn({ role }));
            navigate(role === 'admin' ? '/admin' : role === 'sales' ? '/ventas' : '/');
        } catch (error) {
            console.error('Error de login:', error);
            setErrors(['Credenciales inválidas. Inténtalo de nuevo.']);
        }
    };

    return (
        <Form className='login-form' onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Nombre de Usuario</Form.Label>
                <Form.Control type="text" value={formData.nombreUsuario} onChange={onInputChange} name="nombreUsuario"
                    placeholder="Enter nombreUsuario" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={formData.password} onChange={onInputChange} name="password"
                    placeholder="Password" />
            </Form.Group>
            {errors.length > 0 && errors.map((error, index) => (
                <Alert key={index} variant="danger">{error}</Alert>
            ))}
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
};

export default LoginForm;