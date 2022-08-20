import React, { useState } from "react";
import AuthService from "../services/service";
import { useNavigate, useParams, useLocation } from "react-router-dom";

function UserProfile(props) {
  const navigate = useNavigate();
  const { username } = useParams();
  const [mssg, setMsg] = useState("");
  const userType = useLocation().state.userType;
  const setUser = props.setUser;

  return (
    <div className="profile">
      <header>
        <h1>Hi {username}! Welcome to your page</h1>
        <button
          type="button"
          onClick={async () => {
            var logMsg = await AuthService.logout();
            if (logMsg === "Success!") {
              setUser(false);
              navigate("/login");
            } else {
              setMsg(logMsg);
            }
          }}
        >
          Sign Out
        </button>
      </header>

      <button
        type="button"
        onClick={() => {
          //with no redirect
          // navigate(`/change_pwd`, { state: { username: username } });
          //with redirect
          navigate(`/change_pwd?redirect=https://www.mcgill.ca/`, {
            state: { username: username },
          });
        }}
      >
        Change Password
      </button>
      <button
        type="button"
        onClick={() => {
          navigate(`/modify_profile?redirect=https://www.mcgill.ca/`, {
            state: { username: username, userType: userType },
          });
        }}
      >
        Modify Profile
      </button>

      <span>{mssg}</span>
    </div>
  );
}

export default UserProfile;
