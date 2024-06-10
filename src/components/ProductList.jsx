import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

export const ProductList = () => {
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const deleteProduct = async (productId) => {
    await axios.delete(`http://localhost:4000/product/${productId}`);
    getProducts();
  };

  const downloadCSV = async () => {
    try {
      const response = await axios.get('http://localhost:4000/products', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  return (
    <div>
      <h1 className="title has-text-success">Produk</h1>
      <h2 className="subtitle">Daftar produk</h2>
      <div className="mb-2">
          <Link className="button is-primary mr-2" to="/products/add">
            Tambah Baru
          </Link>
          <button className="button is-success" onClick={downloadCSV}>
            Download Report
          </button>
        </div>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Produk</th>
            <th>Harga</th>
            {user && user.role === 'admin' && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((data, index) => (
            <tr key={data.uuid}>
              <td>{index + 1}</td>
              <td>{data.name}</td>
              <td>{data.price}</td>
              <td>
                {user && user.role === 'admin' && (
                  <div>
                    <Link
                      to={`/product/edit/${data.uuid}`}
                      className="button is-small is-info mr-2"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(data.uuid)}
                      className="button is-small is-danger"
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
