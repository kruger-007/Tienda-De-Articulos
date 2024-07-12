import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import AdminNavBar from './Components/menu/AdminNavBar';
import ClientNavBar from './Components/menu/ClientNavBar';
import SalesNavBar from './Components/menu/SalesNavBar';
import ProductCatalog from './views/client/ProductCatalog';
import ProductCrud from './views/admin/ProductCrud';
import LoginPage from './views/admin/LoginPage';
import CategoryCrud from './Components/Producto/CategoryCrud';
import SalesPage from './views/sales/SalesPage';
import './App.css'

function App() {
  // Obtener el estado de autenticación desde Redux
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);

  // Determinar qué NavBar y rutas mostrar basado en el estado de autenticación y el rol
  let NavBar;
  if (role === "admin") {
    NavBar = <AdminNavBar />;
  } else if (role === "client") {
    NavBar = <ClientNavBar />;
  } else if (role === "sales") {
    NavBar = <SalesNavBar />;
  } else {
    NavBar = null;
  }

  return (
    <div className="app">
      {NavBar}
      <Routes>
        {/* Ruta para la página principal del cliente */}
        <Route path='/' element={<ProductCatalog />} />
        {/* Ruta para la página de login */}
        <Route path='/login' element={<LoginPage />} />
        {/* Ruta protegida para el panel de administrador */}
        <Route path='/admin' element={isLoggedIn && role === "admin" ? <ProductCrud /> : <Navigate to="/" />} />
        {/* Ruta protegida para el panel de administrador */}
        <Route path='/admin/categoria' element={isLoggedIn && role === "admin" ? <CategoryCrud /> : <Navigate to="/" />} />
        <Route path='/ventas' element={isLoggedIn && role === "sales" ? <SalesPage /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;