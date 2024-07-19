import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { signout } from "../api/internal";
import { resetUser } from "../store/userSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.auth);
console.log(isAuthenticated)
  const handleSignout = async () => {
    await signout();
    dispatch(resetUser());
  };


  return (
    <>
      <nav className="flex justify-around items-center py-5 my-5 mx-auto w-[80%]">
        <NavLink to="/" className="font-black text-3xl">
          CoinBounce
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-[#3861fb] text-xl font-bold"
              : "focus:text-[#3861fb] focus:text-xl focus:font-bold text-[21px]"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/crypto"
          className={({ isActive }) =>
            isActive
              ? "text-[#3861fb] text-xl font-bold"
              : "focus:text-[#3861fb] focus:text-xl focus:font-bold text-[21px]"
          }
        >
          Cryptocurrencies
        </NavLink>
        <NavLink
          to="/blogs"
          className={({ isActive }) =>
            isActive
              ? "text-[#3861fb] text-xl font-bold"
              : "focus:text-[#3861fb] focus:text-xl focus:font-bold text-[21px]"
          }
        >
          Blogs
        </NavLink>
        <NavLink
          to="/submit"
          className={({ isActive }) =>
            isActive
              ? "text-[#3861fb] text-xl font-bold"
              : "focus:text-[#3861fb] focus:text-xl focus:font-bold text-[21px]"
          }
        >
          Submit a Blog
        </NavLink>
        {isAuthenticated ? (
          <button onClick={handleSignout} className="ml-3 bg-[#ea3943] text-white border-none outline-none rounded-xl py-3 px-4 cursor-pointer font-bold text-lg hover:bg-[#e01822]">
            Sign out
          </button>
        ) : (
          <div>
            <NavLink to="/login">
              <button className="border-none outline-none rounded-[10px] py-3 px-4 text-lg no-underline  hover:text-black hover:bg-[#f3f3f3]">
                Log In
              </button>
            </NavLink>
            <NavLink to="/signup">
              <button className="ml-10 bg-[#3861fb] text-white border-none outline-none rounded-xl py-3 px-4 cursor-pointer font-bold text-lg hover:bg-[#1f4ffd]">
                Sign Up
              </button>
            </NavLink>
          </div>
        )}
      </nav>
      <div className="h-[1px] mt-1 bg-gradient-to-r from-transparent via-[#9ba3c2] to-transparent"></div>
    </>
  );
};

export default Navbar;
