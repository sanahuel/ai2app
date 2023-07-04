import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import "./Login.css";

const Login = () => {
  let { loginCall } = useContext(AuthContext);
  let { prueba } = useContext(AuthContext);
  return (
    <div className="login-page">
      <div className="login-div">
        <div className="login-span">
          <span>Login</span>
        </div>
        <form onSubmit={loginCall}>
          <div className="input-div">
            <input
              placeholder=" Username"
              name="username"
              className="login-input"
            />
          </div>
          <div className="input-div">
            <input
              placeholder=" Password"
              name="password"
              type={"password"}
              className="login-input"
              autoComplete="false"
            />
          </div>
          <div className="button-div">
            <button className="send-button">Continuar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
