import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//create apps

function AdminDashboard() {
  //Table body data
  const [tbody, setTBody] = useState("");
  useEffect(() => {
    axios
      .get("api/apps")
      .then((res) => {
        let data = "";
        for (const v of res.data) {
          if (v.appType === "type-2") {
            data += ` <tr><td> ${v.appName}</td> <td></td> <td>${v.appType}</td> </tr>`;
          } else {
            data += ` <tr><td> ${v.appName}</td> <td>${v.webhookURL}</td> <td>${v.appType}</td> </tr>`;
          }
        }

        setTBody(data);
        console.log(tbody);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="container mt-5">
      <h2>Registered Apps</h2>
      <table id="appsTable" class="table table-hover">
        <thead>
          <tr>
            <th scope="col">App name</th>
            <th scope="col">webhookURL</th>
            <th scope="col">App type</th>
          </tr>
        </thead>

        <tbody id="appsTableBody"></tbody>
      </table>

      {(() => {
        let table = document.getElementById("appsTableBody");
        if (table) {
          console.log("found");
          table.insertAdjacentHTML("beforeend", tbody);
        }
      })()}

      <Link to="/admin_dashboard/app_reg">Register new app</Link>
    </div>
  );
}

export default AdminDashboard;
