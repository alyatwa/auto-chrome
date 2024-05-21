/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { constants } from "../../utils/constants";

const Login: React.FC = () => {
  return (
    <div className="flex flex-row justify-center items-center w-full h-full rounded-t-xl">
      <img
        src="/images/bg.jpg"
        className="absolute h-[337px] w-[285px] bg-cover object-cover object-left rounded-t-xl"
      />
      <div className="absolute bottom-[53px] bg-gradient-to-t from-[#b4c541] to-transparent h-[48%] w-[284px] opacity-80 rounded-t-xl" />
      <div className="text-4xl leading-10 absolute bottom-[66px] text-white font-semibold z-[20] w-[236px]">
        Login to use AutoFill
      </div>

      <a
        href={constants.login_url}
        target="_blank"
        className="absolute flex justify-center top-6 right-6 bg-[#eafe62] w-[50px] h-[50px] rounded-full"
      >
        <img src="/images/arrow.svg" className=" w-[23px] text-[#0b2938]" />
      </a>
    </div>
  );
};
export default Login;
