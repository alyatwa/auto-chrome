/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */

const HOST = "http://localhost";
const HOST_url = "http://localhost:8000";
const COOKIE_NAME = "chromeToken";
const USER_DATA_NAME = "userData";

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  console.log("Message received: ", message);

  if (true) {
    // Sender Tab useful mostly for background script
    switch (message.type) {
      case "get-user":
        // Tab is useful for instance to obtain the url to fetch the review from
        userHandler(sender.tab, message, sendResponse);
        break;

      default:
        sendResponse("Error: Not found message type");
        break;
    }
    return true; // This is really important, tells the extension whether is an ASYNCHRONOUS sendResponse or not
  }
  return false; // False means synchronous response
});

const userHandler = (tab, message, sendResponse) => {
  let isAuth = false;
  let user = {};
  chrome.cookies.get({ url: HOST, name: COOKIE_NAME }, function (theCookie) {
    if (theCookie) {
      let token = "Bearer " + theCookie.value;
      chrome.storage.local.get([USER_DATA_NAME], function (result) {
        if (!result[USER_DATA_NAME]) {
          fetch(HOST_url + "/api/autofill/chrome-user", {
            method: "GET",
            headers: {
              Authorization: token,
            },
          })
            .then((response) => response.json())
            .then(async (res) => {
              isAuth = true;
              let user_data = res.data;
              user = user_data;
              await chrome.storage.local.set(
                { [USER_DATA_NAME]: user_data },
                function () {
                  sendResponse({
                    type: "get-user",
                    data: {
                      token,
                      isAuth: true,
                      user: result[USER_DATA_NAME],
                    },
                  });
                }
              );
            })
            .catch((error) => console.error("Error:", error));
        } else {
          sendResponse({
            type: "get-user",
            data: {
              token,
              isAuth: true,
              user: result[USER_DATA_NAME],
            },
          });
        }
      });
    } else {
      sendResponse({
        type: "get-user",
        data: {
          token: null,
          isAuth: false,
          user: {},
        },
      });
    }
  });
};
