import { useEffect, useState } from "react";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";

const useAutoLogin = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async function autoLoginApiCall() {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_PATH}/refresh`,
          { withCredentials: true }
        );
        if (response.status === 200) {
          // 1. Set user
          const user = {
            _id: response.data.user._id,
            email: response.data.user.email,
            username: response.data.user.username,
            auth: response.data.auth,
          };

          dispatch(setUser(user));
        }
      } catch (error) {
        console.error('Auto login failed', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  return loading;
};

export default useAutoLogin;
