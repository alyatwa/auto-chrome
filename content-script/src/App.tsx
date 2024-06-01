/// <reference types="chrome" />

import { useState } from "react";
import "./App.css";
import { constants } from "../../src/utils/constants";

function App() {
  const [close, setClose] = useState(true);
  const [content, setContent] = useState("");
  const base_api_url = `${constants.base_api_url}autofill`;

  chrome.runtime.onMessage.addListener(function (
    request,
    _sender,
    sendResponse
  ) {
    switch (request.message) {
      case "startAutofill":
        start(request.token, request.url);
        break;
      case "summarize-now-cs":
        injectResponse(request.data, sendResponse);
        break;
      case "review-now-cs":
        injectResponse(request.data, sendResponse);
        break;
      default:
        sendResponse({ data: "Error: Not found message type" });
        break;
    }
  });
  const apiRequest = async (
    url: string,
    method = "GET",
    body: any = null,
    headers = {}
  ) => {
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
      const message = `An error has occurred: ${response.status}`;
      throw new Error(message);
    }

    return response.json(); // parses JSON response into native JavaScript objects
  };

  const start = (token: string, url: string) => {
    const inputs = getInputsInPage();
    generateValues(inputs, token, url);
  };

  const getInputsInPage = () => {
    const inputsObjects = [];
    const inputsHtml: any[] = [
      ...document.querySelectorAll(
        'input[type="text"], input[type="tel"], input[type="email"]'
      ),
      ...document.getElementsByTagName("textarea"),
    ];

    for (let i = 0; i < inputsHtml.length; i++) {
      const labelElementFor = document.querySelector(
        `label[for='${inputsHtml[i].id}']`
      )?.textContent;

      const labelElementSibling = inputsHtml[i].previousElementSibling;
      const labelSibling =
        labelElementSibling &&
        labelElementSibling.tagName.toLowerCase() === "label"
          ? labelElementSibling.textContent
          : null;

      const labelParent = inputsHtml[i]
        .closest("div")
        ?.querySelector("label")?.textContent;

      const divParent = inputsHtml[i]
        .closest("label")
        ?.querySelector("div")?.textContent;

      inputsObjects.push({
        id: inputsHtml[i].id,
        name: inputsHtml[i].name,
        type: inputsHtml[i].type,
        value: inputsHtml[i].value,
        label: labelElementFor || labelSibling || labelParent || divParent,
      });
    }
    return inputsObjects;
  };

  const generateValues = (inputs: any[], token: string, url: string) => {
    let values: any[] = [];
    apiRequest(
      base_api_url,
      "POST",
      {
        url,
        inputs,
      },
      { Authorization: token }
    )
      .then((res) => {
        values = res.data;
        injectValues(res.data);
      })
      .catch((error) => {
        throw new Error("err in generateValues [content/index.js] " + error);
      });
    return values;
  };

  const injectValues = (values: any[]) => {
    for (const key of values) {
      if (!key.input_name && !key.input_id) continue;

      const selector = key.input_name
        ? `[name='${key.input_name}']`
        : `[id='${key.input_id}']`;

      const input = document.querySelector(selector) as any;

      // If the input exists, set its value to the value associated with the current key
      if (input) {
        input.focus();
        input.value = key.Input_value;
      }
    }
    sendConfirmation();
  };

  const sendConfirmation = () => {
    chrome.runtime.sendMessage(
      {
        type: "autofill-status",
        data: { success: true, msg: "Autofill completed successfully!" },
      },
      function (_response) {
        // console.log(response);
      }
    );
  };
  const injectResponse = (data: any, sendResponse: Function) => {
    setClose(false);
    setContent(data.response.data);
    sendResponse("content injected");
  };
  return (
    <>
      {!close && (
        <div className="flex bg-black/70 z-[1000] fixed w-full h-full border border-gray-200 shadow-lg justify-center items-center ">
          <div className="flex flex-col justify-between bg-white w-1/2 h-[440px] rounded-2xl">
            <Header close={() => setClose(true)} />
            <div
              className="bg-gray-200 h-full p-2 overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: content }}
            />

            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
const Header = ({ close }: { close: () => void }) => {
  return (
    <div className="w-full rounded-t-2xl px-6 py-2 flex justify-between items-center">
      <p className="text-lg text-black">{constants.app_name}</p>
      <button
        onClick={() => close()}
        className="btn text-2xl text-black close-btn"
      >
        ×
      </button>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="w-full rounded-t-2xl px-6 py-4 flex justify-start items-center gap-2">
      <a
        target="_blank"
        href={constants.profile_url}
        className="text-xs text-gray-600"
      >
        Profile
      </a>
      <a
        target="_blank"
        href={constants.support_url}
        className="text-xs text-gray-600"
      >
        Support
      </a>
    </div>
  );
};
export default App;
