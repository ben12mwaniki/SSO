import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AuthService from "../services/service";

//ask for users email address to send link to
function SendPwdResetLink() {
  const formSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .matches(/\S+@\S+\.\S+/, "Invalid email"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const [msg, setMsg] = useState(
    "If this email address is registered in our system, you will receive an email with a link to reset your password"
  );

  async function onSubmit(data) {
    setMsg(await AuthService.sendPwdResetLink(data));
  }

  return (
    <div className="container mt-5">
      <h2> Forgot Password</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Please enter your email below</label>
          <input
            name="email"
            type="text"
            {...register("email")}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.email?.message}</div>
        </div>

        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            Send Link
          </button>
        </div>
        <span className="alert alert-primary" role="alert">
          {msg}
        </span>
      </form>
    </div>
  );
}

export default SendPwdResetLink;
