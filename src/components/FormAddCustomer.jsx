import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GrFormCheckmark } from "react-icons/gr";

const FormAddCustomer = () => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [product, setProduct] = useState("");
  const [products, setProducts] = useState([]);
  const [defaultProduct, setDefaultProduct] = useState('Pilih');
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get("http://localhost:4000/products");
        setProducts(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    getProduct();
  }, [])

  const saveCustomer = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:4000/customers", {
        name: name,
        no_whatsapp: whatsapp,
        productId: product
      });
      navigate("/customers");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title has-text-success">Customer</h1>
      <h2 className="subtitle">Tambah Customer</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content ">
            <form onSubmit={saveCustomer}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Nama</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Customer"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Nomor Whatsapp</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Nomor Whatsapp"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Produk</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}>
                        {defaultProduct ? (
                        <option key={defaultProduct} value={defaultProduct}>
                          Pilih produk
                        </option>
                      ) : null}
                      {products.map((data) => (
                        <option key={data.id} value={data.id}>
                          {data.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="field">
                <div className="control">
                  <button type="submit" className="button is-success has-text-white">
                    <GrFormCheckmark size={25} />
                    Simpan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddCustomer;