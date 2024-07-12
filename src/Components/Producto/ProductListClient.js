import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { Spinner, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { increaseProductQuantity } from '../../store/cartSlice';

const ProductClient = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [cart, setCart] = useState({});
  const dispatch = useDispatch();

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
          setProducts(getFilteredProducts(productsResponse.data, search, categoriesMap));
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

  const getFilteredProducts = (products, search, categories) => {
    let filteredProducts = products;

    if (filteredProducts?.length && search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter((product) => {
        const { descripcion, talla, marca, categoriaId } = product;
        const categoriaDescripcion = categories[categoriaId]?.toLowerCase() || '';

        return (
          descripcion.toLowerCase().includes(searchLower) ||
          talla.toLowerCase().includes(searchLower) ||
          marca.toLowerCase().includes(searchLower) ||
          categoriaDescripcion.includes(searchLower)
        );
      });
    }

    if (orderBy) {
      filteredProducts = filteredProducts.sort((a, b) => {
        if (orderType === 'asc') {
          return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
          return a[orderBy] < b[orderBy] ? 1 : -1;
        }
      });
    }

    return filteredProducts;
  };

  const addToCart = (product) => {
    const updatedCart = { ...cart };
  
    console.log('Cantidad actual antes de actualizar:', updatedCart[product.productoId]?.quantity);
  
    if (updatedCart[product.productoId]) {
      const newQuantity = updatedCart[product.productoId].quantity + 1;
      // Verificar si la nueva cantidad supera el stock disponible
      if (newQuantity <= product.stock) {
        updatedCart[product.productoId].quantity = newQuantity;
        console.log('Producto añadido al carrito:', product.productoId, 'Cantidad:', newQuantity);
        dispatch(increaseProductQuantity({ product, quantityToAdd: 1 }));
      } else {
        setError('No hay suficiente stock disponible');
      }
    } else {
      updatedCart[product.productoId] = {
        quantity: 1,
        product,
      };
      console.log('Producto añadido al carrito:', product.productoId, 'Cantidad:', 1);
      dispatch(increaseProductQuantity({ product, quantityToAdd: 1 }));
    }
  
    // Actualizar el estado del carrito
    setCart(updatedCart);
  };
  


  return (
    <div className="container">
      <h1 className="my-4">Catálogo de Productos</h1>
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
                  <h5 className="card-title">{product.descripcion}</h5>
                  <p className="card-text">Categoría: {categories[product.categoriaId]}</p>
                  <p className="card-text">Marca: {product.marca}</p>
                  <p className="card-text">Talla: {product.talla}</p>
                  <p className="card-text">Precio: ${product.precio}</p>
                  <p className="card-text">Stock: {product.stock}</p>
                  <Button
                    variant="primary"
                    onClick={() => addToCart(product)}
                    disabled={
                      (cart[product.productoId]?.quantity) >= product.stock || // Deshabilitar si la cantidad en el carrito supera o iguala el stock
                      product.stock <= 0 // Deshabilitar si no hay stock disponible
                    }
                  >
                    Añadir al carrito
                  </Button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductClient;