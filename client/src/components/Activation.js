import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Activation() {
  const [msg, setMsg] = useState("");
  const { activationToken } = useParams();
  const navigate = useNavigate();

  const activate = async function (activationToken) {
    return axios
      .get(`../api/activation/${activationToken}`)
      .then((res) => {
        if (res.data.message) {
          setMsg(res.data.message);
          delay(10000).then(navigate("/login"));
        }
      })
      .catch((err) => {
        console.log(err);
        setMsg(err.response.data.error);
      });
  };

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  activate(activationToken);

  return (
    <div className="activation">
      <header>
        <h1>Account activation status</h1>
      </header>
      <span>{msg}</span>
    </div>
  );
}

export default Activation;
