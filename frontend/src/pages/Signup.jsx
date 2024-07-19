import React, { useState } from "react";
import { TextInput } from "../components/index";
import  signupScehma  from "../schema/signupSchema";
import { useFormik } from "formik";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/internal";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const handleSignup = async () => {
    const data={
        name:values.name,
        username:values.username,
        password:values.password,
        confirmPassword:values.confirmPassword,
        email:values.email
    }
    const response=await signup(data);
    console.log(response);
    if (response.status === 201) {
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
     
      }
  };
  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      name: "",
      username: "",
      email:"",
      password:"",
      confirmPassword:""
    },
    validationSchema: signupScehma,
  });
  const disabled=!values.username || !values.password || !values.name||!values.email|| !values.confirmPassword|| errors.username || errors.password || errors.name || errors.email || errors.confirmPassword;
  return(
    <div>
         <p className="text-center text-4xl font-bold p-10 mb-5">
        Create An Account
      </p>

      <TextInput
        type="text"
        name="name"
        value={values.name}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="name"
        error={errors.name && touched.name ? 1 : undefined}
        errormessage={errors.name}
      />
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
        type="email"
        name="email"
        value={values.email}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="email"
        error={errors.email && touched.email ? 1 : undefined}
        errormessage={errors.email}
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
            <TextInput
        type="password"
        name="confirmPassword"
        value={values.confirmPassword}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="confirmPassword"
        error={errors.confirmPassword && touched.confirmPassword ? 1 : undefined}
        errormessage={errors.confirmPassword}
      />


<div className="w-full ">
        <button
          type="submit"
          className={`block w-[30%] mx-auto text-white py-2 px-4 rounded mt-8 ${disabled ? 'bg-blue-300' : 'bg-blue-600'}`}
          disabled={disabled}
          onClick={handleSignup}
        >
          Sign Up
        </button>
      </div>

      <span className="text-center block p-4">
        Alredy have an account? 
        <button
          className="text-lg text-green-600 ml-2 "
          onClick={() => navigate("/signin")}
        >
          Log in
        </button>
      </span>
      {error != '' ? <p className="text-[#de1b55] text-center">{error}</p>:''}
    </div>
  )
};

export default Signup;
