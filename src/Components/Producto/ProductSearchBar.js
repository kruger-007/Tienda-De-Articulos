import { Form, Button } from 'react-bootstrap';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const ProductSearchBar = () => {
    const [search, setSearch] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const onSearchChange = (event) => {
        const value = event.target.value;
        setSearch(value);
    };

    const onClickHandler = () => {
        const params = new URLSearchParams(searchParams);
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }

        setSearchParams(params);
    };

    return (
        <Form className="d-flex search-bar">
            <Form.Control
                type="search"
                placeholder="Search Product"
                className="me-2"
                aria-label="Search"
                value={search}
                onInput={onSearchChange}
            />
            <Button onClick={onClickHandler} variant="outline-success">Search</Button>
        </Form>
    );
};

export default ProductSearchBar;