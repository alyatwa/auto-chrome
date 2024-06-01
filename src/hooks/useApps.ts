import { useGlobalContext } from "../store/chromeStore";
import useReview from "./useReview";
import useSummarize from "./useSummarize";

export const useApps = () => {
  const { setPage } = useGlobalContext();
  const { summarize } = useSummarize();
  const { review } = useReview();

  const apps = [
    {
      name: "summarize",
      label: "Summarize",
      img: "/images/summary.png",
      disabled: false,
      isPaid: false,
      handleClick: () => summarize(),
    },
    {
      name: "fillForm",
      label: "Fill Form",
      img: "/images/form.png",
      disabled: false,
      isPaid: false,
      handleClick: () => setPage("form"),
    },
    {
      name: "writeEmail",
      label: "Write Email",
      img: "/images/email.png",
      disabled: true,
      isPaid: false,
      handleClick: () => {},
    },
    {
      name: "review",
      label: "Review Product",
      img: "/images/review.png",
      disabled: false,
      isPaid: false,
      handleClick: () => review(),
    },
  ];
  return {
    apps,
  };
};
