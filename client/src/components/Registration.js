import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AuthService from "../services/service";
import { useNavigate } from "react-router-dom";

function Registration() {
  const formSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username is required")
      .min(8, "Username is too short")
      .matches(
        /^[a-zA-Z0-9]+$/,
        "Only numbers and letters, no space or special characters"
      ),
    email: Yup.string()
      .required("Email is required")
      .matches(/\S+@\S+\.\S+/, "Invalid email"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password is too short")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "Must contain One Uppercase, One Lowercase, One Number and One Special Character e.g. !@#$%^&*"
      ),
    confirmPwd: Yup.string()
      .required("Password is required")
      .oneOf([Yup.ref("password")], "Password does not match"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const [regMsg, setMsg] = useState("");
  const navigate = useNavigate();

  async function onSubmit(data) {
    setMsg(await AuthService.registerUser(data));

    //Navigate to login
    //navigate("/login");
  }

  return (
    <div className="container mt-5">
      <h2> User Registration</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Username</label>
          <input
            name="username"
            type="text"
            {...register("username")}
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.username?.message}</div>
        </div>

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

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            name="confirmPwd"
            type="password"
            {...register("confirmPwd")}
            className={`form-control ${errors.confirmPwd ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.confirmPwd?.message}</div>
        </div>
        <span className="alert alert-primary" role="alert">
          {regMsg}
        </span>

        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default Registration;
