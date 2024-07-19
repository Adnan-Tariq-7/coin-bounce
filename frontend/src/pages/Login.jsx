import React, { useState } from "react";
import { TextInput } from "../components/index";
import { LoginSchema } from "../schema/LoginSchema";
import { useFormik } from "formik";
import { login } from "../api/internal";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const handleLogin = async () => {
    const data = {
      username: values.username,
      password: values.password,
    };
    const response = await login(data);

    if (response.status === 200) {
      // 1.setUser
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        username: response.data.user.username,
        auth: response.data.auth,
      };

      dispatch(setUser(user));
      // 2.redirect ->homepage
      navigate("/");
    } else if (response.code === "ERR_BAD_REQUEST") {
      //display error message
      setError(response.response.data.message);
      console.log(response.response.data.message)
    }
  };
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: LoginSchema,
  });
  const disabled=!values.username || !values.password || errors.username || errors.password;
  return (
    <div>
      <p className="text-center text-4xl font-bold p-10 mb-5">
        Login to your account
      </p>

      <TextInput
        type="text"
        name="username"
        value={values.username}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Username"
        error={errors.username && touched.username ? 1 : undefined}
        errormessage={errors.username}
      />
      <TextInput
        type="password"
        name="password"
        value={values.password}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="Password"
        error={errors.password && touched.password ? 1 : undefined}
        errormessage={errors.password}
      />
      <div className="w-full ">
        <button
          type="submit"
          className={`block w-[30%] mx-auto text-white py-2 px-4 rounded mt-8 ${disabled ? 'bg-blue-300' : 'bg-blue-600'}`}

          onClick={handleLogin}
          disabled={disabled}
        >
          Log in
        </button>
      </div>

      <span className="text-center block p-4">
        Don't have an account?{" "}
        <button
          className="text-lg text-green-600 ml-2 "
          onClick={() => navigate("/signup")}
        >
          Register
        </button>
      </span>
      {error != '' ? <p className="text-[#de1b55] text-center">{error}</p>:''}
    </div>
  );
};

export default Login;
