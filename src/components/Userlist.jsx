import React, { useState, useEffect } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";


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
            <Link className="button is-primary mb-2 mr-2" to="/users/add">Tambah Baru</Link>
            <button className="button is-success" onClick={downloadCSV}>
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
                            <Link to={`/user/edit/${data.uuid}`} className="button is-small is-info mr-2">Edit</Link>
                            <button onClick={() => deleteUser(data.uuid)} className="button is-small is-danger">Hapus</button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Userlist