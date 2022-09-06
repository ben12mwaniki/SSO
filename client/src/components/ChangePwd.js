import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AuthService from "../services/service";
import { useLocation } from "react-router-dom";

function ChangePwd() {
  const formSchema = Yup.object().shape({
    oldPwd: Yup.string().required("Old password is required"),
    newPwd: Yup.string()
      .required("New password is required")
      .min(6, "Password is too short")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
        "Must contain One Uppercase, One Lowercase, One Number and One Special Character e.g. !@#$%^&*"
      ),
    confirmPwd: Yup.string()
      .required("This field is required")
      .oneOf([Yup.ref("newPwd")], "Password does not match"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const [mssg, setMsg] = useState("");

  var redirect = new URLSearchParams(useLocation().search).get("redirect");

  async function onSubmit(data) {
    setMsg("");
    const response = await AuthService.changePassword(data);
    if (response.message) {
      if (redirect == null || redirect === "") {
        window.location.replace("https://www.google.com/");
      } else {
        window.location.replace(redirect);
      }
    } else {
      setMsg(response.error);
    }
  }

  return (
    <div className="container mt-5">
      <h2> Change your password below </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>Old Password</label>
          <input
            name="oldPwd"
            type="password"
            {...register("oldPwd")}
            className={`form-control ${errors.oldPwd ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.oldPwd?.message}</div>
        </div>

        <div className="form-group">
          <label>New password</label>
          <input
            name="newPwd"
            type="password"
            {...register("newPwd")}
            className={`form-control ${errors.newPwd ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.newPwd?.message}</div>
        </div>
        <div className="form-group">
          <label>Confirm new password</label>
          <input
            name="confirmPwd"
            type="password"
            {...register("confirmPwd")}
            className={`form-control ${errors.confirmPwd ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.confirmPwd?.message}</div>
        </div>

        <span className="alert alert-primary" role="alert">
          {mssg}
        </span>

        <div className="mt-3">
          <button type="submit" className="btn btn-primary">
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePwd;
