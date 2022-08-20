import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AuthService from "../services/service";
import { useNavigate, useLocation } from "react-router-dom";

function Login(props) {
  const formSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .matches(/\S+@\S+\.\S+/, "Invalid email"),
    password: Yup.string().required("Password is required"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const [loginMsg, setMsg] = useState("");
  const navigate = useNavigate();
  const redirect = new URLSearchParams(useLocation().search).get("redirect");
  const setUser = props.setUser;

  async function onSubmit(data) {
    var loginResponse = await AuthService.login(data);

    if (loginResponse.error) {
      setUser(false);
      setMsg(loginResponse.error);
    } else {
      if (redirect === "" || redirect == null) {
        //window.location.replace("https://www.google.com/");
        if (loginResponse.message === "User not registered!") {
          const username = loginResponse.username;
          console.log(username);
          setUser(true);
          navigate(`/create_profile`, { state: { username: username } });
        } else {
          const username = loginResponse.username;
          setUser(true);
          navigate(`/profile/${username}`, {
            state: { userType: loginResponse.userType },
          });
        }
      } else {
        setUser(true);
        window.location.replace(redirect);
      }
    }
  }

  return (
    <div className="container mt-5">
      <h2> User Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Email</label>
          <input
            name="email"
            type="text"
            {...register("email")}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            {...register("password")}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.password?.message}</div>
        </div>

        <span className="alert alert-primary" role="alert">
          {loginMsg}
        </span>

        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </div>
        <div className="mt-3">
          <button
            type="button"
            onClick={() => {
              navigate("/resetpwd_link");
            }}
            className="btn btn-primary"
          >
            Forgot Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
