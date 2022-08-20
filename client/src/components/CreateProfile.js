import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router-dom";
import AuthService from "../services/service";
import * as Yup from "yup";

function CreateProfile() {
  const username = useLocation().state.username;
  console.log(username);
  const [userType, setUserType] = useState("");

  if (userType === "Doctor") {
    return <DoctorProfile username={username} />;
  }
  if (userType === "Patient") {
    return <PatientProfile username={username} />;
  }
  if (userType === "Group") {
    return <GroupProfile username={username} />;
  } else {
    return (
      <>
        <h2>Please select user type</h2>
        <label htmlFor="UserTypes"> Who are you?</label>

        <select
          name="userTypes"
          id="userTypes"
          onChange={() => {
            var user = document.getElementById("userTypes").value;
            setUserType(user);
            console.log(user);
          }}
        >
          <option value=""> Select one</option>
          <option value="Patient">Patient</option>
          <option value="Doctor">Doctor</option>
          <option value="Group">Group</option>
        </select>
      </>
    );
  }
}

function PatientProfile(props) {
  const formSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    address_unit: Yup.string().matches(
      /^$|^[0-9]+$/,
      "The value must be a number"
    ),
    address_street: Yup.string().required("Street name is required"),
    address_country: Yup.string().required("Field is required"),
    address_postal: Yup.string().required("Field is required"),
    phone: Yup.string()
      .required("Field is required")
      .max(10, "Invalid phone number")
      .matches(/^[0-9]+$/, "Invalid phone number"),
    healthInsurance_number: Yup.string().required("Field is required"),
    healthInsurance_expiryYear: Yup.string()
      .required("Field is required")
      .min(2, "Invalid entry")
      .max(4, "Invalid entry")
      .matches(/^[0-9]+$/, "Invalid entry"),
    healthInsurance_expiryMonth: Yup.string()
      .required("Field is required")
      .max(2, "Invalid entry")
      .matches(/^[0-9]+$/, "Invalid entry"),
    alternatePhone: Yup.string()
      .max(10, "Invalid phone number")
      .matches(/^[0-9]+$/, "Invalid phone number"),
  });

  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const [msg, setMsg] = useState("");
  const username = props.username;

  async function onSubmit(data) {
    data.username = username;
    data.userType = "Patient";
    var res = await AuthService.createProfile(data);

    if (res.message) {
      setMsg(res.message);
    } else {
      setMsg(res.error);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>First Name</label>
          <input
            name="firstName"
            type="text"
            {...register("firstName")}
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.firstName?.message}</div>
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            name="lastName"
            type="text"
            {...register("lastName")}
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.lastName?.message}</div>
        </div>
        <h3>Address</h3>
        <div className="form-group">
          <label>Apt/Unit</label>
          <input
            name="address_unit"
            type="text"
            {...register("address_unit")}
            className={`form-control ${
              errors.address_unit ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">{errors.address_unit?.message}</div>
        </div>
        <div className="form-group">
          <label>Street</label>
          <input
            name="address_street"
            type="text"
            {...register("address_street")}
            className={`form-control ${
              errors.address_street ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.address_street?.message}
          </div>
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            name="address_country"
            type="text"
            {...register("address_country")}
            className={`form-control ${
              errors.address_country ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.address_country?.message}
          </div>
        </div>
        <div className="form-group">
          <label>Postal Code</label>
          <input
            name="address_postal"
            type="text"
            {...register("address_postal")}
            className={`form-control ${
              errors.address_postal ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.address_postal?.message}
          </div>
        </div>
        <div className="form-group">
          <label>Phone number</label>
          <input
            name="phone"
            type="text"
            {...register("phone")}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>

        {/* *Patient Specific */}
        <div className="form-group">
          <p>Health Insurance</p>
          <label>Number</label>
          <input
            name="healthInsurance_number"
            type="text"
            {...register("healthInsurance_number")}
            className={`form-control ${
              errors.healthInsurance_number ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.healthInsurance_number?.message}
          </div>
        </div>
        <div className="form-group">
          <label>Expiry Month</label>
          <input
            name="healthInsurance_expiryMonth"
            type="text"
            {...register("healthInsurance_expiryMonth")}
            className={`form-control ${
              errors.healthInsurance_expiryMonth ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.healthInsurance_expiryMonth?.message}
          </div>
        </div>
        <div className="form-group">
          <label>Expiry Year</label>
          <input
            name="healthInsurance_expiryYear"
            type="text"
            {...register("healthInsurance_expiryYear")}
            className={`form-control ${
              errors.healthInsurance_expiryYear ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.healthInsurance_expiryYear?.message}
          </div>
        </div>
        <div className="form-group">
          <label>Alternate Phone</label>
          <input
            name="alternatePhone"
            type="text"
            {...register("alternatePhone")}
            className={`form-control ${
              errors.alternatePhone ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.alternatePhone?.message}
          </div>
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
    </>
  );
}

function DoctorProfile(props) {
  const formSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    address_unit: Yup.string().matches(
      /^$|^[0-9]+$/,
      "The value must be a number"
    ),
    address_street: Yup.string().required("Street name is required"),
    address_country: Yup.string().required("Field is required"),
    address_postal: Yup.string().required("Field is required"),
    phone: Yup.string()
      .required("Field is required")
      .max(10, "Invalid phone number")
      .matches(/^[0-9]+$/, "Invalid phone number"),
    licenseNumber: Yup.string().required("This field is required"),
    faxNumber: Yup.string()
      .required("This field is required")
      .matches(/^[0-9]+$/, "Invalid fax number"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const username = props.username;
  const [msg, setMsg] = useState("");

  async function onSubmit(data) {
    data.username = username;
    data.userType = "Doctor";
    var res = await AuthService.createProfile(data);

    if (res.message) {
      setMsg(res.message);
    } else {
      setMsg(res.error);
    }
  }

  return (
    <div className="container mt-5">
      <h2> Create Your Doctor Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>First Name</label>
          <input
            name="firstName"
            type="text"
            {...register("firstName")}
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.firstName?.message}</div>
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            name="lastName"
            type="text"
            {...register("lastName")}
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.lastName?.message}</div>
        </div>
        <h3>Address</h3>
        <div className="form-group">
          <label>Apt/Unit</label>
          <input
            name="address_unit"
            type="text"
            {...register("address_unit")}
            className={`form-control ${
              errors.address_unit ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">{errors.address_unit?.message}</div>
        </div>
        <div className="form-group">
          <label>Street</label>
          <input
            name="address_street"
            type="text"
            {...register("address_street")}
            className={`form-control ${
              errors.address_street ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.address_street?.message}
          </div>
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            name="address_country"
            type="text"
            {...register("address_country")}
            className={`form-control ${
              errors.address_country ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.address_country?.message}
          </div>
        </div>
        <div className="form-group">
          <label>Postal Code</label>
          <input
            name="address_postal"
            type="text"
            {...register("address_postal")}
            className={`form-control ${
              errors.address_postal ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.address_postal?.message}
          </div>
        </div>
        <div className="form-group">
          <label>Phone number</label>
          <input
            name="phone"
            type="text"
            {...register("phone")}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>

        {/**Doctor Specific */}

        <div className="form-group">
          <label>License number (MLN) </label>
          <input
            name="licenseNumber"
            type="text"
            {...register("licenseNumber")}
            className={`form-control ${
              errors.licenseNumber ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.licenseNumber?.message}
          </div>
        </div>

        <div className="form-group">
          <label>Fax number</label>
          <input
            name="faxNumber"
            type="text"
            {...register("faxNumber")}
            className={`form-control ${errors.faxNumber ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.faxNumber?.message}</div>
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

function GroupProfile(props) {
  const formSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    address_unit: Yup.string().matches(
      /^$|^[0-9]+$/,
      "The value must be a number"
    ),
    address_street: Yup.string().required("Street name is required"),
    address_country: Yup.string().required("Field is required"),
    address_postal: Yup.string().required("Field is required"),
    phone: Yup.string()
      .required("Field is required")
      .max(10, "Invalid phone number")
      .matches(/^[0-9]+$/, "Invalid phone number"),
    organizationName: Yup.string().required("This field is required"),
    faxNumber: Yup.string()
      .required("This field is required")
      .matches(/^[0-9]+$/, "Invalid fax number"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const username = props.username;
  const [msg, setMsg] = useState("");

  async function onSubmit(data) {
    data.username = username;
    data.userType = "Group";
    var res = await AuthService.createProfile(data);
    if (res.message) {
      setMsg(res.message);
    } else {
      setMsg(res.error);
    }
  }

  return (
    <div className="container mt-5">
      <h2> Create Your Group Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>First Name</label>
          <input
            name="firstName"
            type="text"
            {...register("firstName")}
            className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.firstName?.message}</div>
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            name="lastName"
            type="text"
            {...register("lastName")}
            className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.lastName?.message}</div>
        </div>
        <div className="form-group">
          <label> Organization Name </label>
          <input
            name="organizationName"
            type="text"
            {...register("organizationName")}
            className={`form-control ${
              errors.organizationName ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.organizationName?.message}
          </div>
        </div>
        <h3>Address</h3>
        <div className="form-group">
          <label>Apt/Unit</label>
          <input
            name="address_unit"
            type="text"
            {...register("address_unit")}
            className={`form-control ${
              errors.address_unit ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">{errors.address_unit?.message}</div>
        </div>
        <div className="form-group">
          <label>Street</label>
          <input
            name="address_street"
            type="text"
            {...register("address_street")}
            className={`form-control ${
              errors.address_street ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.address_street?.message}
          </div>
        </div>
        <div className="form-group">
          <label>Country</label>
          <input
            name="address_country"
            type="text"
            {...register("address_country")}
            className={`form-control ${
              errors.address_country ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.address_country?.message}
          </div>
        </div>
        <div className="form-group">
          <label>Postal Code</label>
          <input
            name="address_postal"
            type="text"
            {...register("address_postal")}
            className={`form-control ${
              errors.address_postal ? "is-invalid" : ""
            }`}
          />
          <div className="invalid-feedback">
            {errors.address_postal?.message}
          </div>
        </div>
        <div className="form-group">
          <label>Phone number</label>
          <input
            name="phone"
            type="text"
            {...register("phone")}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>
        <div className="form-group">
          <label>Fax number</label>
          <input
            name="faxNumber"
            type="text"
            {...register("faxNumber")}
            className={`form-control ${errors.faxNumber ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.faxNumber?.message}</div>
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

export default CreateProfile;
