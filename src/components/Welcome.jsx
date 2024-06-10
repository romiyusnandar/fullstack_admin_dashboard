import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);

  let bonus = customers.length * 100000;
  if (customers.length >= 10) {
    bonus = customers.length * 100000 + 1000000;
  }

  useEffect(() => {
    getProducts();
    getCustomers();
    getUser();
    getTotalPrice();
  }, []);

  const getProducts = async () => {
    try {
      const response = await axios.get('http://localhost:4000/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const getCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers', error);
    }
  };

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:4000/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const getTotalPrice = async () => {
    const response = await axios.get("http://localhost:4000/customers/totalPrice");
    setTotalPrice(response.data.total);
  };

  const formatRupiah = (angka) => {
    return angka.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  };

  const backupDatabase = async () => {
    try {
      const response = await axios.get('http://localhost:4000/backup');
      alert(response.data);
      await downloadBackup();
    } catch (error) {
      console.error('Backup error karena:', error);
      alert('Backup gagal.');
    }
  };

  const downloadBackup = async () => {
    try {
      const response = await axios.get('http://localhost:4000/download-backup', {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aqiqah_db_backup.sql';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      alert('Backup file downloaded successfully.');
    } catch (error) {
      console.error('Error downloading backup file:', error);
      alert('Download failed.');
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const restoreDatabase = async (event) => {
    event.preventDefault();
    if (!file) {
      alert('Pilih file untuk di upload.');
      return;
    }

    const formData = new FormData();
    formData.append('sqlfile', file);

    try {
      const response = await axios.post('http://localhost:4000/import-database', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data);
    } catch (error) {
      console.error('Restore error karena:', error);
      alert('Restore gagal.');
    }
  };

  return (
    <div>
      <div className="container mt-5">
        <h1 className="title has-text-link">Hi...</h1>
        <h2 className="subtitle">
          Welcome back{' '}
          <strong className="has-text-black">{user && user.name}</strong>
        </h2>
      </div>
      <div className="columns mt-5">
        {user && user.role === 'admin' && (
          <div className="column">
            <div className="card">
              <div className="card-content">
                <p className="title has-text-centered">Users</p>
                <hr class="divider"></hr>
                <p className="subtitle has-text-centered">{users.length}</p>
              </div>
            </div>
            <div className="card">
              <div className="card-content">
                <p className="title has-text-centered">Pendapatan</p>
                <hr class="divider"></hr>
                <p className="subtitle has-text-centered">{formatRupiah(totalPrice)}</p>
              </div>
            </div>
          </div>
        )}
        <div className="column">
          <div className="card">
            <div className="card-content">
              <p className="title has-text-centered">Customers</p>
              <hr class="divider"></hr>
              <p className="subtitle has-text-centered">
                {customers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="column">
          <div className="card">
            <div className="card-content">
              <p className="title has-text-centered">Produk</p>
              <hr class="divider"></hr>
              <p className="subtitle has-text-centered">{products.length}</p>
            </div>
          </div>
        </div>
        {user && user.role === 'user' && (
          <div className="column">
            <div className="card">
              <div className="card-content">
                <p className="title has-text-centered">Bonus</p>
                <hr class="divider"></hr>
                <p className="subtitle has-text-centered">{formatRupiah(bonus)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="container">
        {user && user.role === 'admin' && (
          <>
            <button
              className="button is-primary mb-5"
              onClick={backupDatabase}
            >
              Backup Database
            </button>
            <div>
              <div className="file has-name">
                <label className="file-label">
                  <input className="file-input " type="file" name="sqlfile" onChange={handleFileChange} />
                  <span className="file-cta">
                    <span className="file-label">Pilih file...</span>
                  </span>
                  {file && <span className="file-name has-text-black">{file.name}</span>}
                </label>
                  <button className="button is-warning ml-4" type="submit" onClick={restoreDatabase}>
                    Restore Database
                  </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Welcome;
