import React from 'react';
import ProductListClient from "../../Components/Producto/ProductListClient";
import ProductSearchBar from '../../Components/Producto/ProductSearchBar';
import SortingDropdown from '../../Components/Producto/sortingDropdown';

const ProductCatalog = () => {
    return (
        <div className="home-page">
            <div className="home-page-header">
                <ProductSearchBar />
            </div>
            <SortingDropdown />
            <ProductListClient/>
        </div>
    );
};

export default ProductCatalog;