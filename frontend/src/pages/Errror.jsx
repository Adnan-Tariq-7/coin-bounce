import React from "react";
import { Link } from "react-router-dom";

const Errror = () => {
  return (
    <div className="flex justify-center items-center flex-col h-[80vh]">
      <div className="text-[#ea3943] text-4xl">Error 404 - Page is not found</div>
      <div className="text-4xl font-bold mt-4">Go back to <Link className="text-blue-600 " to='/'>Home</Link></div>
    </div>
  );
};

export default Errror;
