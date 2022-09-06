import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import AuthService from "../services/service";
import axios from "axios";

function ModifyProfile() {
  const userType = useLocation().state.userType;
  var redirect = new URLSearchParams(useLocation().search).get("redirect");

  if (userType === "Doctor") {
    return <DoctorProfile redirect={redirect} />;
  }
  if (userType === "Patient") {
    return <PatientProfile redirect={redirect} />;
  }
  if (userType === "Group") {
    return <GroupProfile redirect={redirect} />;
  }
}

function PatientProfile(props) {
  const [user, setUser] = useState();

  useEffect(() => {
    axios
      .get("api/user")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        setMsg(err.res.data.error);
      });
  }, []);

  const formSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    address_unit: Yup.string().matches(
      /^$|^[0-9]+$/,
      "The value must be a number"
    ),
    address_street: Yup.string(),
    address_country: Yup.string(),
    address_postal: Yup.string(),
    phone: Yup.string()
      .max(10, "Invalid phone number")
      .matches(/^$|^[0-9]+$/, "The value must be a number"),
    healthInsurance_number: Yup.string(),
    healthInsurance_expiryYear: Yup.string()
      .max(4, "Invalid entry")
      .matches(/^$|^[0-9]+$/, "The value must be a number"),
    healthInsurance_expiryMonth: Yup.string()
      .max(2, "Invalid entry")
      .matches(/^$|^[0-9]+$/, "The value must be a number"),
    alternatePhone: Yup.string()
      .max(10, "Invalid phone number")
      .matches(/^$|^[0-9]+$/, "The value must be a number"),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const [msg, setMsg] = useState("");

  async function onSubmit(data) {
    setMsg("");
    const res = await AuthService.modifyProfile(data);
    if (res.error) {
      console.log(res.error);
      setMsg(res.error);
    } else {
      if (props.redirect === "" || props.redirect === null) {
        setMsg(res.message);
        setMsg(res.message);
      } else {
        setMsg(res.message);
        window.location.replace(props.redirect);
      }
    }
  }

  return (
    <div className="container mt-5">
      <h2> Modify Your Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>First Name</label>
          <input
            name="firstName"
            type="text"
            defaultValue={user ? user.firstName : ""}
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
            defaultValue={user ? user.lastName : ""}
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
            defaultValue={user ? user.address.unit : ""}
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
            defaultValue={user ? user.address.street : ""}
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
            defaultValue={user ? user.address.country : ""}
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
            defaultValue={user ? user.address.postal : ""}
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
            defaultValue={user ? user.phone : ""}
            {...register("phone")}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>

        {/**Patient Specific */}

        <div className="form-group">
          <p>Health Insurance</p>
          <label>Number</label>
          <input
            name="healthInsurance_number"
            type="text"
            defaultValue={user ? user.healthInsurance.number : ""}
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
            defaultValue={user ? user.healthInsurance.expiryMonth : ""}
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
            defaultValue={user ? user.healthInsurance.expiryYear : ""}
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
            defaultValue={user ? user.alternatePhone : ""}
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
    </div>
  );
}

function DoctorProfile(props) {
  const [user, setUser] = useState();

  useEffect(() => {
    axios
      .get("api/user")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        setMsg(err.res.data.error);
      });
  }, []);

  const formSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    address_unit: Yup.string().matches(
      /^$|^[0-9]+$/,
      "The value must be a number"
    ),
    address_street: Yup.string(),
    address_country: Yup.string(),
    address_postal: Yup.string(),
    phone: Yup.string()
      .max(10, "Invalid phone number")
      .matches(/^$|^[0-9]+$/, "The value must be a number"),
    licenceNumber: Yup.string(),
    faxNumber: Yup.string().matches(
      /^$|^[0-9]+$/,
      "The value must be a number"
    ),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const [msg, setMsg] = useState("");

  async function onSubmit(data) {
    setMsg("");
    const res = await AuthService.modifyProfile(data);
    if (res.error) {
      console.log(res.error);
      setMsg(res.error);
    } else {
      if (props.redirect === "" || props.redirect === null) {
        setMsg(res.message);
      } else {
        setMsg(res.message);
        window.location.replace(props.redirect);
      }
    }
  }

  return (
    <div className="container mt-5">
      <h2> Modify Your Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>First Name</label>

          <input
            name="firstName"
            type="text"
            defaultValue={user ? user.firstName : ""}
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
            defaultValue={user ? user.lastName : ""}
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
            defaultValue={user ? user.address.unit : ""}
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
            defaultValue={user ? user.address.street : ""}
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
            defaultValue={user ? user.address.country : ""}
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
            defaultValue={user ? user.address.postal : ""}
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
            defaultValue={user ? user.phone : ""}
            {...register("phone")}
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">{errors.phone?.message}</div>
        </div>

        {/**Doctor Specific info */}
        <div className="form-group">
          <label>License number (MLN) </label>
          <input
            name="licenseNumber"
            type="text"
            defaultValue={user ? user.licenseNumber : ""}
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
            defaultValue={user ? user.faxNumber : ""}
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
  const [user, setUser] = useState();

  useEffect(() => {
    axios
      .get("api/user")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
        setMsg(err.res.data.error);
      });
  }, []);

  const formSchema = Yup.object().shape({
    firstName: Yup.string(),
    lastName: Yup.string(),
    address_unit: Yup.string().matches(
      /^$|^[0-9]+$/,
      "The value must be a number"
    ),
    address_street: Yup.string(),
    address_country: Yup.string(),
    address_postal: Yup.string(),
    phone: Yup.string()
      .max(10, "Invalid phone number")
      .matches(/^$|^[0-9]+$/, "The value must be a number"),
    organizationName: Yup.string(),
    faxNumber: Yup.string().matches(
      /^$|^[0-9]+$/,
      "The value must be a number"
    ),
  });
  const formOptions = { resolver: yupResolver(formSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors } = formState;
  const [msg, setMsg] = useState("");

  async function onSubmit(data) {
    const res = await AuthService.modifyProfile(data);
    if (res.error) {
      console.log(res.error);
      setMsg(res.error);
    } else {
      if (props.redirect === "" || props.redirect === null) {
        setMsg(res.message);
      } else {
        setMsg(res.message);
        window.location.replace(props.redirect);
      }
    }
  }

  return (
    <div className="container mt-5">
      <h2> Modify Your Profile</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label>First Name</label>
          <input
            name="firstName"
            type="text"
            defaultValue={user ? user.firstName : ""}
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
            defaultValue={user ? user.lastName : ""}
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
            defaultValue={user ? user.organizationName : ""}
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
            defaultValue={user ? user.address.unit : ""}
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
            defaultValue={user ? user.address.street : ""}
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
            defaultValue={user ? user.address.country : ""}
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
            defaultValue={user ? user.address.postal : ""}
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
            defaultValue={user ? user.phone : ""}
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
            defaultValue={user ? user.faxNumber : ""}
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

export default ModifyProfile;
