import { useEffect, useState } from "react";

export const useApp = () => {
  const [isAuth, setAuth] = useState(false);
  const [user, setUser] = useState({ name: "John Doe" });

  useEffect(() => {
    initApp();
  }, []);

  const initApp = () => {
    try {
      chrome.runtime.sendMessage({ command: "InitApp" }, function (response) {
        console.log("I received response init!");
        console.log(response);
        setUser(response.user);
        setAuth(response.isAuth);
      });
    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  };
  return {
    user,
    isAuth,
  };
};
