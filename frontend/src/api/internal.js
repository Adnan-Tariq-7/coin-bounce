import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_PATH,
  // baseURL: "http://localhost:3000",
  withCredentials: true, //Include cookies in request
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data) => {
  let response;

  try {
    response = await api.post("/login", data);
  } catch (error) {
    return error;
  }

  return response;
};

export const signup = async (data) => {
  let response;
  try {
    response = await api.post("/register", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const signout = async () => {
  let response;
  try {
    response = await api.post("/logout");
  } catch (error) {
    return error;
  }
  return response;
};

export const getAllBlogs = async () => {
  let response;
  try {
    response = await api.get("/blog/all");
  } catch (e) {
    return e;
  }
  return response;
};

export const submitBlog = async (data) => {
  let response;

  try {
    response = await api.post("/blog", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const getBlogById = async (id) => {
  let response;
  try {
    response = await api.get(`/blog/${id}`);
  } catch (error) {
    return error;
  }
  return response;
};

export const getCommentsById = async (id) => {
  let response;
  try {
    response = await api.get(`comment/${id}`, { validateStatus: false });
  } catch (error) {
    return error;
  }
  return response;
};

export const postComment = async (data) => {
  let response;
  try {
    response = await api.post("/comment", data);
  } catch (error) {
    return error;
  }
  return response;
};

export const deleteBlog = async (id) => {
  let response;
  try {
    response = await api.delete(`/blog/${id}`);
  } catch (error) {
    return error;
  }
  return response;
};

export const updateBlog = async (data) => {
  let response;
  try {
    response = await api.put("/blog", data);
  } catch (error) {
    return error;
  }
  return response;
};

// auto token refresh
// protected-resource -> 401
// refresh -> authenticated state
// protected-resource

api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originalReq = error.config;

    if ((error.response.status === 401 ||error.response.status===500) && originalReq && !originalReq._isRetry) {
      originalReq.isRetry = true;
      try {
        await axios.get(`${import.meta.env.VITE_API_PATH}/refresh`, {
          withCredentials: true,
        });

        return api.request(originalReq);
      } catch (error) {
        return error;
      }
    }
  }
);
