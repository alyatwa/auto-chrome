/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useGlobalContext } from "../../store/chromeStore";
import Button from "../../components/UI/Button";

const Settings: React.FC = () => {
  const { user, refreshUser, loading } = useGlobalContext();

  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full h-full">
      <div className="flex flex-col text-xs gap-4 w-[180px] rounded-xl text-[#0b2938]">
        <p>
          <span>Name: </span>
          {user?.name}
        </p>
        <p>
          <span>Email: </span>
          {user?.email}
        </p>
        <p>
          <span>Plan: </span>
          {user?.plan.name}
        </p>
      </div>

      <Button disabled={loading} onClick={() => refreshUser()}>
        Refresh
      </Button>
    </div>
  );
};
export default Settings;
