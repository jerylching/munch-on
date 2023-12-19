import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin, setUser } from "../../state/index.jsx";
import guestImage from "../../assets/guest.png";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  username: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  // picture: yup.string().required('required'),
});

const initialValuesRegister = {
  email: "",
  password: "",
  username: "",
  firstName: "",
  lastName: "",
};
const initialValuesLogin = {
  email: "",
  password: "",
};

const LoginForm = () => {
  const [pageType, setPageType] = useState("login");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const loginUser = async (credentials) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error; // Rethrow the error for the caller to handle
    }
  };

  const registerUser = async (values) => {
    try {
      // Construct JSON payload from form values
      const payload = {
        email: values.email,
        password: values.password,
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,

        // Include picture handling here if needed
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Registration error details:",
          JSON.stringify(errorData, null, 2)
        );
        throw new Error(errorData.message || "Registration failed");
      }
      alert("Registration is successful");

      return await response.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  };

  const handleFormSubmit = async (
    values,
    { resetForm, setErrors, setSubmitting }
  ) => {
    try {
      let result;
      if (isLogin) {
        result = await loginUser(values);
        if (result) {
          dispatch(
            setUser({
              username: result.user, // Use optional chaining here as well
              token: result.token,
            })
          );
          console.log("User:", result.token);
          navigate("/home");
        }
      } else if (isRegister) {
        result = await registerUser(values);
        if (result) {
          // After successful registration, redirect to the login page
          setPageType("login");
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setErrors({ submit: error.message || "Unknown error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuestLogin = () => {
    dispatch(
      setLogin({
        user: {
          username: "Guest",
          picture: guestImage,
        },
      })
    );
    navigate("/home");
  };

  const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
  });

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  error={
                    Boolean(touched.firstName) && Boolean(errors.firstName)
                  }
                  helperText={touched.firstName && errors.firstName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="Last name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  label="User name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.username}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  sx={{ gridColumn: "span 4" }}
                />
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: "#AD8157",
                color: "#E5D9D2",
                "&:hover": { backgroundColor: "#1F3528" },
              }}
            >
              {isLogin ? "LOGIN" : "REGISTER"}
            </Button>
            <Button
              onClick={handleGuestLogin}
              fullWidth
              sx={{
                m: "0.1rem 0",
                p: "1rem",
                backgroundColor: "#AD8157",
                color: "#E5D9D2",
                "&:hover": { backgroundColor: "#1F3528" },
              }}
            >
              Continue as Guest
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? "register" : "login");
                resetForm();
              }}
              sx={{
                textDecoration: "underline",
                color: "#1F3528",
                "&:hover": { color: "#AD8157" },
              }}
            >
              {isLogin
                ? "Don't have an account? Sign up here."
                : "Already have an account? Login here"}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default LoginForm;
