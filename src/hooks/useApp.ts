import { useEffect, useState } from "react";

export const useApp = () => {
  const [isAuth, setAuth] = useState(false);
  const [user, setUser] = useState<User | null>();

  const initApp = () => {
    try {
      (async () => {
        await chrome.runtime.sendMessage(
          {
            command: "InitApp",
          },
          function (response) {
            if (chrome.runtime.lastError) {
              console.log(
                "Failed to send message:",
                chrome.runtime.lastError.message
              );
            } else {
              console.log("Message sent, response:", response);
            }
          }
        );
      })();
    } catch (error) {
      console.log(`Unexpected error: ${error}`);
    }
  };

  useEffect(() => {
    initApp();
  }, []);

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    if (request.command === "get-user") {
      setUser(request.data.user as User);
      setAuth(request.data.isAuth);
      sendResponse({ farewell: "goodbye" });
    }
  });

  return {
    user,
    isAuth,
  };
};
