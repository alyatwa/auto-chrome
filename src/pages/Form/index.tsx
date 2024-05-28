/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Button from "../../components/UI/Button";
import { useGlobalContext } from "../../store/chromeStore";
import { useToast } from "../../components/Toast/ToastService";
import { constants } from "../../utils/constants";

const Form: React.FC = () => {
  const { token, loading, setLoading } = useGlobalContext();
  const toast = useToast();

  const handleFillBtn = () => {
    setLoading(true);
    toast.open("Filling form started!", 2000);
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id as any, {
        message: "startAutofill",
        url: activeTab.url,
        title: activeTab.title,
        token,
      });
    });
  };

  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full h-full">
      <Button disabled={loading} onClick={() => handleFillBtn()}>
        {loading ? "Loading" : "Fill"}
      </Button>

      <div className="w-[180px] rounded-xl  border border-solid border-[#0b2938] p-2 text-xs text-[#0b2938]">
        Ensure to fill all your{" "}
        <a href={constants.base_url} target="_blank">
          profile
        </a>{" "}
        details in the web app to get best results
      </div>
    </div>
  );
};
export default Form;
