import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { TbLock } from "react-icons/tb";
import bgImage from "../login-pg.webp";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user || isSuccess) {
            navigate("/dashboard");
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);

    const Auth = (e) => {
        e.preventDefault();
        dispatch(LoginUser({ email, password }));
    };

    return (
        <section className="hero is-fullheight is-fullwidth" style={{ position: "relative", overflow: "hidden" }}>
            <div className="background-image" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                <img src={bgImage} alt="" style={{ objectFit: "cover", height: "100vh", width: "100vw" }} />
            </div>
            <div className="hero-body" style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <div className="container">
                    <div className="columns is-centered">
                        <div className="column is-4">
                            <form onSubmit={Auth} className="box has-background-grey-darker">
                                <h2 className="title has-text-centered has-text-white">Login</h2>
                                {isError && <p className="has-text-centered mb-5 has-text-white">{message}</p>}

                                <div className="field">
                                    <p className="control has-icons-left">
                                        <input
                                            type="email"
                                            className="input"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                        <span className="icon is-small is-left">
                                            <i><HiOutlineEnvelope /></i>
                                        </span>
                                    </p>
                                </div>

                                <div className="field">
                                    <p className="control has-icons-left">
                                        <input
                                            type="password"
                                            className="input"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                        <span className="icon is-small is-left">
                                            <i><TbLock /></i>
                                        </span>
                                    </p>
                                </div>

                                <div className="field mt-5">
                                    <button
                                        type="submit"
                                        className="button is-success is-fullwidth"
                                    >
                                        {isLoading ? "Loading..." : "Login"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
