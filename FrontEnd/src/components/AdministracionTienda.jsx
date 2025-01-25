import axios from 'axios';
import { ItemSearch } from './ItemSearch';
import { Productos } from './Productos';
import React, { useEffect, useState } from 'react';

export function AdministracionTienda() {
  const [productos, setProductos] = useState([]);
  const [categoria, setCategoria] = useState(null);
  const [pattern, setPattern] = useState(null);
  const [categorias, setCategorias] = useState([]);

  // Cargar categorías al montar el componente
  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/producto-categorias`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((response) => {
        setCategorias(response.data.categorias);
      })
      .catch((error) => {
        console.error('Error al obtener categorías:', error);
        alert('No se pudo cargar las categorías. Intente más tarde.');
      });
  }, []); // Ejecuta solo al montar

  // Cargar productos cuando cambia la categoría o el patrón
  useEffect(() => {
    cargarProductos();
  }, [categoria, pattern]); // Ejecuta cada vez que cambia la categoría o el patrón

  const cargarProductos = () => {
    let opts = [];
    if (categoria) opts.push(`categoria=${categoria}`);
    if (pattern) opts.push(`pattern=${pattern}`);
    const queryString = opts.length > 0 ? `?${opts.join('&')}` : '';
    axios
      .get(`http://localhost:3000/api/productos${queryString}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      })
      .then((response) => {
        setProductos(response.data.productos);
      })
      .catch((error) => {
        console.error('Error al obtener productos:', error);
        alert('No se pudo cargar los productos. Intente más tarde.');
      });
  };

  return (
    <>
      <ItemSearch
        categorias={categorias}
        setCategoria={setCategoria}
        setPattern={setPattern}
        onActualizarProductos={cargarProductos}
      />
      <Productos
        categorias={categorias}
        productos={productos}
        totalPages={Math.ceil(productos.length / 10)}
        onActualizarProductos={cargarProductos}
      />
    </>
  );
}
