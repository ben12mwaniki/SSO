import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AuthService from "../services/service";
import { useParams, useNavigate } from "react-router-dom";

//Form to enter new password after clicking reset link
function ResetPwd2() {
  const formSchema = Yup.object().shape({
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
  const { resetToken } = useParams();
  const navigate = useNavigate();

  async function onSubmit(data) {
    data.resetToken = resetToken;
    var res = await AuthService.resetPwd(data);
    if (res.error) {
      setMsg(res.error);
    } else {
      setMsg(res.message);
      delay(3000).then(navigate("/login"));
    }
  }

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  return (
    <div className="container mt-5">
      <h2> Reset your password below </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}

export default ResetPwd2;
