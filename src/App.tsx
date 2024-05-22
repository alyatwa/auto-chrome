import { useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import "./reset.css";
import { useGlobalContext } from "./store/chromeStore";
import { constants } from "./utils/constants";

function App() {
  const { getUser, user, auth } = useGlobalContext();
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="flex flex-col items-center justify-center p-2 w-[300px] h-[400px] bg-[#0b2938]">
      {auth ? <Home /> : <Login />}
      <footer className="p-2.5 w-full h-[50px] border-t border-solid border-[#0b2938] bg-white rounded-b-xl">
        <div className="flex flex-row justify-between h-full w-full items-center text-xs text-[#0b2938]">
          {auth ? (
            <>
              <p className="">User: {user?.name}</p>
              <p className="">Current Plan: {user?.plan.name}</p>
            </>
          ) : (
            <div className="inline-flex gap-4  ">
              <a
                href={constants.login_url}
                target="_blank"
                className=" text-[#0b2938]"
              >
                Login
              </a>

              <a
                href={constants.register_url}
                target="_blank"
                className=" text-[#0b2938]"
              >
                Register
              </a>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

export default App;
