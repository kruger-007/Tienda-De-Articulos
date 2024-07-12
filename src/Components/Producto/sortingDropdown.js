import { Dropdown } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

const SortingDropdown = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const onSelectOption = (orderBy, orderType) => {
    const params = new URLSearchParams(searchParams);
    params.set('orderBy', orderBy);
    params.set('orderType', orderType);
    setSearchParams(params);
  };

  return (
    <Dropdown className="d-inline mx-4 product-sorting">
      <Dropdown.Toggle id="dropdown-autoclose-true">
        Sort By
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => onSelectOption('precio', 'asc')}>
          Precio (Menor a Mayor)
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onSelectOption('precio', 'desc')}>
          Precio (Mayor a Menor)
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default SortingDropdown;