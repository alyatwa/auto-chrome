import { useGlobalContext } from "../store/chromeStore";
import useSummarize from "./useSummarize";

export const useApps = () => {
  const { setPage } = useGlobalContext();
  const { summarize } = useSummarize();

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
      name: "settings",
      label: "Settings",
      img: "/images/setting.png",
      disabled: false,
      isPaid: false,
      handleClick: () => setPage("settings"),
    },
  ];
  return {
    apps,
  };
};
