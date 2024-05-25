/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-unused-vars */

const HOST = "http://localhost";
const HOST_url = "http://localhost:8000";
const COOKIE_NAME = "chromeToken";
const USER_DATA_NAME = "userData";
const OpenAI_url = "https://chatgpt.com/api/auth/session";
const OPEN_AI_TOKEN = "openAIToken";

const apiRequest = async (url, method = "GET", body = null, headers = {}) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error(response.status);
  }

  return response.json(); // parses JSON response into native JavaScript objects
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  //console.log("Message received: ", message);

  if (true) {
    // Sender Tab useful mostly for background script
    switch (message.type) {
      case "get-user":
        userHandler(sender.tab, message, sendResponse);
        break;
      case "refresh-user":
        refreshHandler(sender.tab, message, sendResponse);
        break;
      case "summarize-now-bg":
        summarizeNowBG(message.tabId, message.url, message.token, sendResponse);
        break;
      case "authOpenAI":
        authOpenAI(sender.tab, message, sendResponse);
        break;
      default:
        sendResponse({ data: "Error: Not found message type" });
        break;
    }
    return true; // This is really important, tells the extension whether is an ASYNCHRONOUS sendResponse or not
  }
  return false; // False means synchronous response
});

const refreshHandler = (tab, message, sendResponse) => {
  let isAuth = false;
  let user = {};
  chrome.cookies.get({ url: HOST, name: COOKIE_NAME }, function (theCookie) {
    if (theCookie) {
      let token = "Bearer " + theCookie.value;

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
                type: "refresh-user",
                data: {
                  success: true,
                  token,
                  isAuth: true,
                  user: user_data,
                },
              });
            }
          );
        })
        .catch((error) => {
          sendResponse({
            type: "refresh-user",
            data: {
              success: false,
              msg: "Error: Refreshing user data",
              error,
            },
          });
          console.error("Error:", error);
        });
    } else {
      sendResponse({
        type: "refresh-user",
        data: {
          success: false,
          error: "Login required!",
          msg: "Login required!",
          token: null,
          isAuth: false,
          user: {},
        },
      });
    }
  });
};

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
              "Content-Type": "application/json",
              "x-requested-with": "XMLHttpRequest",
              Authorization: token,
            },
          })
            .then((response) => response.json())
            .then(async (res) => {
              console.log(res);
              if (res.code == 401 || res.code == 500) {
                sendResponse({
                  type: "get-user",
                  data: {
                    msg: res.message,
                    token: null,
                    isAuth: false,
                    user: {},
                  },
                });
              } else {
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
              }
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
          msg: "Login required!",
          token: null,
          isAuth: false,
          user: {},
        },
      });
    }
  });
};

const authOpenAI = (tab, message, sendResponse) => {
  chrome.storage.local.get([OPEN_AI_TOKEN], function (result) {
    if (!result[OPEN_AI_TOKEN]) {
      fetch(OpenAI_url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(async (res) => {
          console.log("OpenAI Token: ", res);
          const token = res.accessToken;
          await chrome.storage.local.set({ [OPEN_AI_TOKEN]: token });
          sendResponse({
            type: "authOpenAI",
            data: { token },
            success: true,
          });
        })
        .catch((error) => {
          console.error("Error:", error);
          sendResponse({
            type: "authOpenAI",

            data: { token: null, error },
            success: false,
          });
        });
    } else {
      sendResponse({
        type: "authOpenAI",
        data: { success: true, token: result[OPEN_AI_TOKEN] },
      });
    }
  });
};

const summarizeNowBG = (tabId, url, token, sendResponse) => {
  apiRequest(
    HOST_url + "/api/autofill/summarize",
    "POST",
    {
      url,
    },
    {
      Authorization: token,
    }
  )
    .then(async (res) => {
      console.log("tabId", tabId);
      await chrome.tabs.sendMessage(tabId, {
        message: "summarize-now-cs",
        data: {
          success: true,
          url,
          response: res,
        },
      });
      sendResponse({
        type: "summarize-now",
        data: {
          success: true,
          msg: "Summarize completed successfully!",
          response: res,
        },
      });
    })
    .catch((error) => {
      console.log("Error:", error);
      sendResponse({
        type: "summarize-now",
        data: {
          success: false,
          msg: "Error: Summarize",
          error: JSON.stringify(error),
        },
      });
    });
};
