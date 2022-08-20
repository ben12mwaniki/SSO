import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import AuthService from "../services/service";

function AdminDashboard() {
  const formSchema = Yup.object().shape({
    app_name: Yup.string().required("App name is required"),
    webhook_URL: Yup.string().required("Field is required"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const [msg, setMsg] = useState("");

  async function onSubmit(data) {
    setMsg("This dash is being tested");
  }

  return (
    <div className="container mt-5">
      <h2> App Registration</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>App Name</label>
          <input
            name="app_name"
            type="text"
            {...register("app_name")}
            className={`form-control ${errors.app_name ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.app_name?.message}</div>
        </div>

        <div className="form-group">
          <label>Webhook URL</label>
          <input
            name="webhook_URL"
            type="text"
            {...register("webhook_URL")}
            className={`form-control ${errors.webhook_URL ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.webhook_URL?.message}</div>
        </div>

        <span className="alert alert-primary" role="alert">
          {msg}
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

export default AdminDashboard;
