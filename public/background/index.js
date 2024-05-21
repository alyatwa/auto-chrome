/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */

const HOST = "http://localhost:8000/";
const COOKIE_NAME = "token";
const USER_DATA_NAME = "userData";

chrome.runtime.onStartup.addListener(function () {
  console.log("Extension has been started");
  init();
});

chrome.runtime.onInstalled.addListener(function () {
  console.log("Extension has been installed...");
  init();
});
chrome.runtime.onMessage.addListener(function (message, _sender, sendResponse) {
  if (message.command === "GetCookies") {
    chrome.cookies.get({ url: HOST, name: COOKIE_NAME }, function (theCookies) {
      console.log(theCookies);
      sendResponse(theCookies);
    });
  }

  if (message.command === "InitApp") {
    sendResponse(init());
  }

  if (message.command === "GetUserToken") {
    chrome.storage.local.get(["token"]).then((result) => {
      sendResponse(result);
    });

    if (message.command === "SetUserToken") {
      SetUserToken(message.token);
    }
  }
});

async function SetUserToken(token: string) {
  try {
    await chrome.storage.local.set({ token });
  } catch (error) {
    console.log(error);
  }
}

const init = () => {
  let isAuth = false;
  let user = {};
  chrome.cookies.get({ url: HOST, name: COOKIE_NAME }, function (theCookie) {
    if (theCookie) {
      chrome.storage.local.get([USER_DATA_NAME], function (result) {
        if (!result[USER_DATA_NAME]) {
          fetch(HOST + "api/user", {
            headers: {
              Authorization: "Bearer " + theCookie.value,
            },
          })
            .then((response) => response.json())
            .then(async (data) => {
              isAuth = true;
              user = data;
              // Save the user data in local storage
              await chrome.storage.local.set(
                { [USER_DATA_NAME]: data },
                function () {
                  console.log("User data saved in local storage");
                }
              );
            })
            .catch((error) => console.error("Error:", error));
        } else {
          isAuth = true;
          user = result[USER_DATA_NAME];
        }
      });
    } else {
      console.log("User should login first...");
      user = null;
      isAuth = false;
    }
  });
  return { isAuth, user };
};
