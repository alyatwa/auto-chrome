import { useToast } from "../components/Toast/ToastService";
import { useGlobalContext } from "../store/chromeStore";

const useReview = () => {
  const { token, reviewNow, setLoading } = useGlobalContext();
  const toast = useToast();

  const review = () => {
    if (token) {
      setLoading(true);
      toast.open("Review started", 1500);
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var activeTab = tabs[0];
        reviewNow({
          tabId: activeTab.id,
          type: "review-now-bg",
          url: activeTab.url,
          title: activeTab.title,
          token,
        });
      });
    } else {
      toast.open("Please login");
    }
  };
  return {
    review,
  };
};

export default useReview;
