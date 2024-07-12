import ProductList from '../../Components/Producto/ProductList';
import ProductSearchBar from '../../Components/Producto/ProductSearchBar';
import SortingDropdown from '../../Components/Producto/sortingDropdown';
import SaveProductDialog from '../../Components/Producto/SaveProductDialog'

const ProductCrud = () => {
    return ( 
        <div className="home-page">
            <div className="home-page-header">
                <ProductSearchBar />
                <SaveProductDialog />
            </div>
            <SortingDropdown />
            <ProductList />
        </div>
    );
};

export default ProductCrud;