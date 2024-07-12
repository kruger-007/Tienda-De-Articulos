import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import DeleteProduct from './DeleteProduct';
import UpdateProductDialog from './UpdateProductDialog';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search');
  const orderBy = searchParams.get('orderBy');
  const orderType = searchParams.get('orderType');
  const refresh = searchParams.get('refresh');

  const cachedRemoveRefreshQueryParam = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (refresh) {
      params.delete('refresh');
    }
    setSearchParams(params);
  }, [refresh, searchParams, setSearchParams]);

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setIsLoading(true);
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_PRODUCTS_API_URL}Producto`, {
            params: {
              orderBy,
              orderType
            }
          }),
          axios.get(`${process.env.REACT_APP_PRODUCTS_API_URL}Categoria`)
        ]);

        if (productsResponse.status === 200 && categoriesResponse.status === 200) {
          const categoriesMap = categoriesResponse.data.reduce((map, category) => {
            map[category.categoriaId] = category.descripcion;
            return map;
          }, {});
          setCategories(categoriesMap);
          setProducts(getFilteredProducts(productsResponse.data, search));
          setError('');
        } else {
          setProducts([]);
          setError('Unexpected error while retrieving data');
        }
      } catch (error) {
        setProducts([]);
        setError('Unexpected error while retrieving data');
      } finally {
        setIsLoading(false);
        cachedRemoveRefreshQueryParam();
      }
    };

    fetchProductsAndCategories();
  }, [search, orderBy, orderType, cachedRemoveRefreshQueryParam]);

  const getFilteredProducts = (products, search) => {
    if (products?.length && search) {
      const searchLower = search.toLowerCase();
      return products.filter((product) => {
        if (product.productoId === parseInt(search, 10)) {
          return true;
        }
        return product.descripcion.toLowerCase().includes(searchLower);
      });
    }
    return products;
  };

  const handleUpdateProduct = (id, updatedProduct) => {
    setProducts((prevProducts) =>
      prevProducts.map(product =>
        product.productoId === id ? { ...product, ...updatedProduct } : product
      )
    );
  };

  return (
    <div className="container">
      <h1 className="my-4">Lista de Productos</h1>
      {isLoading && (
        <div className="div-spinner-column">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      {!isLoading && products?.length === 0 && (
        <p className="text-center">No hay productos disponibles.</p>
      )}
      {!isLoading && error && (
        <p className="text-center text-danger">{error}</p>
      )}
      {!isLoading && products?.length > 0 && (
        <div className="row row-cols-1 row-cols-md-3 g-4">
          {products.map((product) => (
            <div key={product.productoId} className="col mb-4">
              <div className="card h-100">
                <img
                  src={product.imagen}
                  className="card-img-top"
                  alt={product.descripcion}
                  style={{ height: '80%', objectFit: 'contain' }}
                />
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <DeleteProduct id={product.productoId}></DeleteProduct>
                    <UpdateProductDialog
                      product={product}
                      onUpdate={handleUpdateProduct}
                    />
                  </div>
                  <h5 className="card-title">{product.descripcion}</h5>
                  <p className="card-text">Id: {product.productoId}</p>
                  <p className="card-text">Categoría: {categories[product.categoriaId]}</p>
                  <p className="card-text">Marca: {product.marca}</p>
                  <p className="card-text">Talla: {product.talla}</p>
                  <p className="card-text">Precio: ${product.precio}</p>
                  <p className="card-text">Stock: {product.stock}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;