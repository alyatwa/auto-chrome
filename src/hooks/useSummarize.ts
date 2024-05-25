import { useToast } from "../components/Toast/ToastService";
import { useGlobalContext } from "../store/chromeStore";

const useSummarize = () => {
  const { token, summarizeNow, setLoading } = useGlobalContext();
  const toast = useToast();

  const summarize = () => {
    if (token) {
      setLoading(true);
      toast.open("Summarizing...");
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        summarizeNow({
          tabId: activeTab.id,
          type: "summarize-now-bg",
          url: activeTab.url,
          title: activeTab.title,
          token,
        });
      });
    } else {
      toast.open("Please login to OpenAI first");
    }
  };
  return {
    summarize,
  };
};

export default useSummarize;
