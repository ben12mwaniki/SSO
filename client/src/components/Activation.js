import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Activation() {
  const { activationToken } = useParams();
  const navigate = useNavigate();
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios
      .get(`../api/activation/${activationToken}`)
      .then((res) => {
        if (res.data.message) {
          setMsg(res.data.message);
          navigate("/login");
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(err.response.data.error);
      });
  }, [activationToken, navigate]);

  return (
    <div className="activation">
      <header>
        <h1>Account activation status</h1>
      </header>
      <span className="alert alert-danger" role="alert">
        {msg}
      </span>
    </div>
  );
}

export default Activation;
