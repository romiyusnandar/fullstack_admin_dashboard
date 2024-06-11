import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TbUserPlus } from "react-icons/tb";
import { PiDownload } from "react-icons/pi";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";

export const Customerlist = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    getCustomers();
  }, []);

  const getCustomers = async () => {
    const response = await axios.get("http://localhost:4000/customers");
    setCustomers(response.data);
    console.log(response.data);
  };

  const deleteCustomer = async (customerId) => {
    await axios.delete(`http://localhost:4000/customer/${customerId}`);
    getCustomers();
  };

  const downloadCSV = async () => {
    try {
      const response = await axios.get('http://localhost:4000/customers', {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers.csv');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error downloading CSV:', error);
    }
  };

  const formatRupiah = (angka) => {
    return angka.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  };

  return (
    <div>
      <h1 className="title has-text-success">Customers</h1>
      <h2 className="subtitle">Daftar customer</h2>
      <div className='mb-2'>
        <Link className="button is-primary mb-2 mr-2 has-text-white" to="/customers/add">
        <TbUserPlus size={25} />
          Tambah Baru
        </Link>
        <button className="button is-success has-text-white" onClick={downloadCSV}>
          <PiDownload size={25}/>
          Download Report
        </button>
      </div>
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Customer</th>
            <th>Pesanan</th>
            <th>Harga</th>
            <th>Whatsapp</th>
            <th>Ditambahkan Oleh</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer.uuid}>
              <td>{index + 1}</td>
              <td>{customer.name}</td>
              <td>{customer.product.name}</td>
              <td>{formatRupiah(customer.product.price)}</td>
              <td>{customer.no_whatsapp}</td>
              <td>{customer.user.name}</td>
              <td>
                <Link to={`/customer/edit/${customer.uuid}`} className="button is-small is-info mr-2 has-text-white"><TbEdit size={25}/>Edit</Link>
                <button onClick={() => deleteCustomer(customer.uuid)} className="button is-small is-danger has-text-white"><MdDeleteOutline size={25}/>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Customerlist;
