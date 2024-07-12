import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Table, Spinner } from "react-bootstrap";
import axios from "axios";
import SaveCategoryDialog from "./SaveCategoryDialog";
import DeleteCategory from "./DeleteCategory";
import UpdateCategoryDialog from "./UpdateCategoryDialog";
import ProductSearchBar from './ProductSearchBar';
import './CategoryCrud.css';

const CategoryCrud = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get('search');
    const refresh = searchParams.get('refresh');

    const cachedRemoveRefreshQueryParam = useCallback(() => {
        const params = new URLSearchParams(searchParams);
        if (refresh) {
            params.delete('refresh');
        }
        setSearchParams(params);
    }, [refresh, searchParams, setSearchParams]);

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${process.env.REACT_APP_PRODUCTS_API_URL}Categoria`)
            .then((response) => {
                if (response.status === 200) {
                    setCategories(getFilteredCategories(response.data, search));
                    setError('');
                } else {
                    setCategories([]);
                    setError(response.message || 'Unexpected error while retrieving categories');
                }
            }).catch(() => {
                setCategories([]);
                setError('Unexpected error while retrieving categories');
            }).finally(() => {
                setIsLoading(false);
                cachedRemoveRefreshQueryParam();
            });
    }, [search, cachedRemoveRefreshQueryParam]);

    const TABLE_HEADERS = ["Id", "Category", "Actions"];

    const getFilteredCategories = (categories, search) => {
        if (categories?.length && search) {
            return categories.filter((category) => {
                const keys = Object.keys(category);
                let isMatchingCategory = false;
                for (const key of keys) {
                    const value = category[key];
                    if (value && value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1) {
                        isMatchingCategory = true;
                    }
                }
                return isMatchingCategory;
            });
        }
        return categories;
    };

    const handleCategoryUpdate = (categoryId, updatedData) => {
        setCategories((prevCategories) =>
            prevCategories.map(category =>
                category.categoriaId === categoryId ? { ...category, ...updatedData } : category
            )
        );
    };

    return (
        <div>
            <div className="category-page-header">
                <ProductSearchBar />
                <SaveCategoryDialog />
            </div>
            <Table className="categories-table" striped>
                <thead>
                    <tr>
                        {TABLE_HEADERS.map(header => <th key={header}>{header}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {isLoading && (
                        <tr>
                            <td className="table-spinner-column" colSpan={TABLE_HEADERS.length}>
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </td>
                        </tr>
                    )}
                    {!isLoading && categories.length === 0 && (
                        <tr>
                            <td colSpan={TABLE_HEADERS.length}>
                                <p className="category-table-message">No hay categorías en el sistema.</p>
                            </td>
                        </tr>
                    )}
                    {!isLoading && error && (
                        <tr>
                            <td colSpan={TABLE_HEADERS.length}>
                                <p className="category-table-message">{error}</p>
                            </td>
                        </tr>
                    )}
                    {!isLoading && categories.length > 0 && categories.map(category =>
                        <tr key={category.categoriaId}>
                            <td>{category.categoriaId}</td>
                            <td>{category.descripcion}</td>
                            <td className="delete-save-buttons">
                                <div className="d-flex">
                                    <DeleteCategory id={category.categoriaId} />
                                    <UpdateCategoryDialog
                                        category={category}
                                        onUpdate={handleCategoryUpdate}
                                    />
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </div>
    );
};

export default CategoryCrud;