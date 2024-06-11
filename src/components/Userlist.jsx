import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";
import { PiDownload } from "react-icons/pi";
import { TbUserPlus } from "react-icons/tb";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";

const Userlist = () => {
    const { user } = useSelector((state) => state.auth);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUser();
    }, [])

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:4000/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users", error);
        }
    }

        const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:4000/user/${userId}`);
            getUser();
        } catch (error) {
            console.error("Error deleting user", error);
        }
    }

    const downloadCSV = async () => {
      try {
        const response = await axios.get('http://localhost:4000/users', {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users.csv');
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error('Error downloading CSV:', error);
      }
    };

    return (
        <div>
            <h1 className="title has-text-success">Users</h1>
            <h2 className="subtitle">List users</h2>
            <Link className="button is-primary mb-2 mr-2 has-text-white" to="/users/add"><TbUserPlus size={25}/>Tambah Baru</Link>
            <button className="button is-success has-text-white" onClick={downloadCSV}>
              <PiDownload size={25} />
              Download Report
          </button>
            <table className="table is-striped is-fullwidth">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((data, index) => (
                    <tr key={data.uuid}>
                        <td>{index + 1}</td>
                        <td>{data.name}</td>
                        <td>{data.email}</td>
                        <td>{data.role}</td>
                        <td>
                            <Link to={`/user/edit/${data.uuid}`} className="button is-small is-info mr-2 has-text-white"><TbEdit size={25}/>Edit</Link>
                            <button onClick={() => deleteUser(data.uuid)} className="button is-small is-danger has-text-white"><MdDeleteOutline size={25}/>Hapus</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Userlist