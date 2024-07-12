import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import {increaseProductQuantity } from '../../store/cartSlice';

const ProductClient = ({ product }) => {
  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch(increaseProductQuantity({
      product,
    }))
  };

  return (
    <div className="col mb-4">
      <div className="card h-100">
        <img
          src={product.imagen}
          className="card-img-top"
          alt={product.descripcion}
          style={{ height: '80%', objectFit: 'contain' }}
        />
        <div className="card-body">
          <h5 className="card-title">{product.descripcion}</h5>
          <p className="card-text">Id: {product.productoId}</p>
          <p className="card-text">Categoria: {product.categoriaId}</p>
          <p className="card-text">Marca: {product.marca}</p>
          <p className="card-text">Talla: {product.talla}</p>
          <p className="card-text">Precio: ${product.precio}</p>
          <p className="card-text">Stock: {product.stock}</p>
          <Button variant="primary" onClick={addToCart}>Añadir al carrito</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductClient;