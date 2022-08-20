import axios from "axios";

class AuthService {
  registerUser(data) {
    return axios
      .post("api/registration", data)
      .then((response) => {
        if (response.data.message) {
          return response.data.message;
        } else {
          return response.data.error;
        }
      })
      .catch((err) => {
        console.log(err);
        return err.response.data.error;
      });
  }

  login(data) {
    return axios
      .post("api/login", data)
      .then((response) => {
        if (response.data.message) {
          return {
            message: response.data.message,
            username: response.data.username,
            userType: response.data.userType,
          };
        } else {
          return response.data.error;
        }
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }

  sendPwdResetLink(data) {
    return axios
      .post("api/pwdreset_link", data)
      .then((response) => {
        if (response.data.message) {
          return response.data.message;
        } else {
          return response.data.error;
        }
      })
      .catch((err) => {
        console.log(err);
        return err.response.data.error;
      });
  }

  resetPwd(data) {
    return axios
      .patch("../api/reset_pwd", data)
      .then((response) => {
        if (response.data.message) {
          return response.data;
        } else {
          return response.data;
        }
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }

  changePassword(data) {
    return axios
      .patch(`../api/change_pwd`, data)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }

  logout() {
    return axios
      .get("../api/logout")
      .then((res) => {
        if (res.data.message) {
          return res.data.message;
        }
      })
      .catch((err) => {
        console.log(err);
        return err.response.data.error;
      });
  }

  createProfile(data) {
    return axios
      .patch(`../api/create_profile`, data)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }
  modifyProfile(data) {
    return axios
      .patch(`../api/modify_profile`, data)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log(err);
        return err.response.data;
      });
  }

  authenticate() {
    return axios
      .get("../api/authentication")
      .then((res) => {
        if (res) {
          return res;
        }
      })
      .catch((err) => {
        if (err) {
          return err;
        }
      });
  }

  registerApp(data) {
    return axios
      .post("api/app_registration", data)
      .then((response) => {
        if (response.data.message) {
          return response.data.message;
        } else {
          return response.data.error;
        }
      })
      .catch((err) => {
        console.log(err);
        return err.response.data.error;
      });
  }
}

export default new AuthService();
