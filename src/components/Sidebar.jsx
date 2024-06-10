import React from 'react'
import { NavLink, useNavigate } from "react-router-dom"
import { AiOutlineHome } from "react-icons/ai";
import { IoPricetagsOutline, IoPersonOutline } from "react-icons/io5";
import { SlUserFollowing } from "react-icons/sl";
import { GoPeople } from "react-icons/go";
import { CiLogout } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const logout = () => {
        dispatch(LogOut());
        dispatch(reset());
        navigate("/");
    }

    return (
        <div className="">
            <aside className="menu pl-2 has-shadow">
                <p className="menu-label">General</p>
                <ul className="menu-list">
                    <li>
                        <NavLink to={"/dashboard"}><AiOutlineHome/> Dashboard</NavLink>
                    </li>
                    <li>
                        <NavLink to={"/customers"}><GoPeople /> Customer</NavLink>
                    </li>
                    <li>
                        <NavLink to={"/products"}><IoPricetagsOutline/> Products</NavLink>
                    </li>
                </ul>

                { user && user.role === "admin" && (
                  <div>
                  <p className="menu-label">Admin</p>
                      <ul className="menu-list">
                          <li>
                              <NavLink to={"/users"}><SlUserFollowing /> Users</NavLink>
                          </li>
                      </ul>
                  </div>
                )}

                <p className="menu-label">Settings</p>
                <ul className="menu-list">
                    <li>
                        <button onClick={logout} className="button is-white is-align-items-center"><CiLogout/> Logout</button>
                    </li>
                </ul>
            </aside>
        </div>
    )
}

export default Sidebar