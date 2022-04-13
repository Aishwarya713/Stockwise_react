import React, { useState } from "react";
import {
  Grid,
  CircularProgress,
  Typography,
  Button,
  Tabs,
  Tab,
  TextField,
  Fade,
} from "@material-ui/core";
import { withRouter } from "react-router-dom";
import classnames from "classnames";

// styles
import useStyles from "./styles";

// logo
import logo from "./logo.svg";

// context
import { useUserDispatch, loginUser } from "../../context/UserContext";
import axios from "axios";

function Login(props) {
  var classes = useStyles();

  // global
  var userDispatch = useUserDispatch();

  // local
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(null);
  var [isOtpInputVisible, setIsOtpInputVisible] = useState(false);
  var [nameValue, setNameValue] = useState("");
  var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState("");

  const handleButtonClick = () => {
    if (isOtpInputVisible) {
      setIsLoading(true)
      axios.post('http://localhost:5000/api/v1/user/verifyOtp', {
        "mobile": loginValue,
        "otp": passwordValue
      })
        .then(function (response) {
          console.log(response);
          if (response.status === 200) {
            loginUser(
              userDispatch,
              loginValue,
              passwordValue,
              props.history,
              setIsLoading,
              setError,
              response.data.data.token,
              JSON.stringify(response.data.data.users)
            )
          }
          setIsLoading(false)
        })
        .catch(function (error) {
          console.log(error);
          setIsLoading(false)
        });
    }
    else {
      setIsLoading(true)
      axios.post('http://localhost:5000/api/v1/user/sendOtp', {
        "mobile": loginValue
      })
        .then(function (response) {
          console.log(response);
          setIsLoading(false)
        })
        .catch(function (error) {
          console.log(error);
          setIsLoading(false)
        });
      setIsOtpInputVisible(true)
    }
  }

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>Stock Update</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
          <React.Fragment>
            <TextField
              id="mobileNumber"
              InputProps={{
                classes: {
                  underline: classes.textFieldUnderline,
                  input: classes.textField,
                  className: classes.input
                },
              }}
              value={loginValue}
              onChange={e => setLoginValue(e.target.value)}
              margin="normal"
              placeholder="Mobile Number"
              name='phone'
              fullWidth
            />
            {
              isOtpInputVisible && <TextField
                id="otp"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                margin="normal"
                placeholder="Enter OTP"
                type="number"
                fullWidth
              />
            }
            <div className={classes.formButtons}>
              {isLoading ? (
                <CircularProgress size={26} className={classes.loginLoader} />
              ) : (
                <Button
                  disabled={
                    isOtpInputVisible ? loginValue.length === 0 || passwordValue.length === 0 : loginValue.length !== 10
                  }
                  onClick={() =>
                    handleButtonClick()
                  }
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  {!isOtpInputVisible ? "Send OTP" : "Login"}
                </Button>
              )}

            </div>
          </React.Fragment>

        </div>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
