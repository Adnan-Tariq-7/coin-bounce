import React from "react";
import { Navbar, Footer } from "./components/index";
import {
  Errror,
  Home,
  Blog,
  SubmitBlog,
  BlogDetails,
  UpdateBlog,
} from "./pages/index";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Protected } from "./components/index";
import { Login } from "./pages/index";
import { Signup } from "./pages/index";
import { useSelector } from "react-redux";
import useAutoLogin from "./hooks/useAutoLogin";
import { Loader } from "./components/index";

const App = () => {
  const isAuth = useSelector((state) => state.user.auth);
  const loading = useAutoLogin();
  console.log(loading)
  return loading ? (
    <Loader text="..." />
  ) : (
    <div>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/crypto" exact element={<Home />} />
              <Route
                path="/blogs"
                exact
                element={
                  <Protected isAuth={isAuth}>
                    <Blog />
                  </Protected>
                }
              />
              <Route
                path="/blog/:id"
                exact
                element={
                  <Protected isAuth={isAuth}>
                    <BlogDetails />
                  </Protected>
                }
              />
              <Route
                path="/blog-update/:id"
                exact
                element={
                  <Protected isAuth={isAuth}>
                    <UpdateBlog />
                  </Protected>
                }
              />
              <Route
                path="/submit"
                exact
                element={
                  <Protected isAuth={isAuth}>
                    <SubmitBlog />
                  </Protected>
                }
              />
              <Route path="/login" exact element={<Login />} />
              <Route path="/signup" exact element={<Signup />} />
              <Route path="*" element={<Errror />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
