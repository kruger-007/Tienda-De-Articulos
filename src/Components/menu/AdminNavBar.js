import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logOut } from '../../store/AuthSlice';

const AdminNavBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const logOutHandler = () => {
        dispatch(logOut());
        navigate('/');
    };
    
    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    <Nav.Link as={Link} to="/admin">Home</Nav.Link>
                    <Nav.Link as={Link} to="/admin/categoria">Categoria</Nav.Link>
                        <NavDropdown title="Account"
                            id="basic-nav-dropdown">
                            <NavDropdown.Item onClick={logOutHandler}>Log Out</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
export default AdminNavBar;