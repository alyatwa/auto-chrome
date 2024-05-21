/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Button from "../../components/UI/Button";
import apiRequest from "../../helpers/api";
import { autoFillForm } from "../../utils/formUtils";
import { useToast } from "../../components/Toast/ToastService";

const Home: React.FC = () => {
  //const [inputs, setInputs] = React.useState<Input[]>([]);
  const [loading, setLoading] = React.useState(false);
  const toast = useToast();

  const fillForm = () => {
    setLoading(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      function getInputsInPage() {
        const inputsObjects: Input[] = [];
        const inputsHtml = [
          ...document.querySelectorAll(
            'input[type="text"], input[type="tel"], input[type="email"]'
          ),
          ...document.getElementsByTagName("textarea"),
        ] as any[];

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
        console.log(inputsObjects);
        // https://developer.chrome.com/docs/extensions/mv3/messaging/
        (async () => {
          const reponse = await chrome.runtime.sendMessage({
            info: inputsObjects || [],
          });
          console.log(reponse);
        })();
      }

      chrome.scripting
        .executeScript({
          target: { tabId: tab.id ?? 0 },
          func: getInputsInPage,
        })
        .then(() => console.log("Injected a function!"));
    });
  };

  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    const resp = request.info;
    if (resp) {
      //setInputs(resp);
      apiRequest("autofill", "POST", { url: sender.tab?.url, inputs: resp })
        .then((data) => {
          setLoading(false);
          console.log(data);
          autoFillForm(data.inputs);
          toast.open("Form filled successfully", 2000);
        })
        .catch((error) => console.error(error));
      console.log(resp);
      sendResponse({ farewell: "thanks for sending! goodbye" });
    }
  });

  return (
    <div className="flex flex-col gap-4 justify-between items-center bg-white rounded-xl w-full h-full">
      <div className="flex flex-row justify-center items-center w-full h-full">
        <Button disabled={loading} onClick={() => fillForm()}>
          {loading ? "Loading" : "Fill"}
        </Button>
      </div>
    </div>
  );
};
export default Home;
