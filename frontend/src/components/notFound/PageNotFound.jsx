import React from "react";
import { Link, useNavigate } from "react-router-dom";
const PageNotFound = () => {
    const navigate = useNavigate();
    const handleGoBack = ()=>{
        navigate(-1);
    }
  return (
    <div className=" w-full h-screen fixed  z-9999 bg-black text-white flex items-center justify-center">
      <div className=" w-[90%] md:w-[60%] lg:w-[40%] flex items-center flex-col  bg-zinc-900 justify-center p-10 rounded-lg">
        <h1 className="text-7xl  font-black font-mono text-orange-500 ">404</h1>
        <h2 className=" text-xl text-center text-zinc-400 capitalize  font-bold">
          page not found
        </h2>
        <p className="text-center  text-sm mt-2 text-slate-500">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row w-full items-center pt-4 gap-2">
          <Link to="/" className="flex-1 px-6 text-center w-full py-3 bg-orange-600 text-white rounded-lg  font-light hover:bg-orange-700 transition button-press shadow-md">
            Go to Home
          </Link>
          <button onClick={handleGoBack} className="flex-1 px-6 text-center w-full py-3 bg-gray-400 text-white rounded-lg  font-light hover:bg-gray-500 transition button-press shadow-md  ">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
