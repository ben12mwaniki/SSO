import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Registration from "./components/Registration";
import Login from "./components/Login";
import AuthService from "./services/service";

import UserProfile from "./components/UserProfile";
import React, { useState, useEffect } from "react";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Routes,
  useNavigate,
} from "react-router-dom";
import ChangePwd from "./components/ChangePwd";
import Activation from "./components/Activation";
import ResetPwd from "./components/ResetPwd";
import SendPwdResetLink from "./components/SendPwdResetLink";
import CreateProfile from "./components/CreateProfile";
import ModifyProfile from "./components/ModifyProfile";
import AdminDashboard from "./components/AdminDashboard";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <main>
          <nav className="navbar navbar-dark bg-dark">
            <ul className="list-group list-group-horizontal-lg">
              <li className="list-group-item">
                <Link to="/">Home</Link>
              </li>
              <li className="list-group-item">
                <Link to="/registration">Sign Up</Link>
              </li>
              <li className="list-group-item">
                <Link to="/login?redirect=">Sign In</Link>
              </li>
              <li className="list-group-item">
                <Link to="/admin_dashboard">Admin Dashboard</Link>
              </li>
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registration" element={<Registration />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/admin_dashboard" element={<AdminDashboard />} />
            <Route
              path="/profile/:username"
              element={
                <ProtectedRoute user={user} setUser={setUser}>
                  <UserProfile setUser={setUser} />
                </ProtectedRoute>
              }
            />
            <Route
              path="change_pwd"
              element={
                <ProtectedRoute user={user} setUser={setUser}>
                  <ChangePwd />
                </ProtectedRoute>
              }
            />
            <Route path="/reset_pwd/:resetToken" element={<ResetPwd />} />
            <Route path="/resetpwd_link" element={<SendPwdResetLink />} />
            <Route path="/create_profile" element={<CreateProfile />} />
            <Route
              path="/modify_profile"
              element={
                <ProtectedRoute user={user} setUser={setUser}>
                  <ModifyProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/activation/:activationToken"
              element={<Activation />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <header>
      <h1> Welcome to Trakadis Lab!</h1>
      <img
        src="https://nck.ca/wp-content/uploads/2021/08/NCK-McGill-Pavillon-trottier-building-montreal-2020-3-2000x1500.jpg"
        alt="Trottier building @McGill"
        object-fit="cover"
      ></img>
    </header>
  );
}

function ProtectedRoute(props) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.user) {
      authenticate();
    }
  });

  async function authenticate() {
    var res = await AuthService.authenticate();

    if (res.data === "OK") {
      props.setUser(true);
    } else {
      navigate("/login", { replace: true });
    }
  }

  return <div>{props.user === true && props.children}</div>;
}

export default App;
