import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Message, sendMessage } from "./sendMessage";
import { useToast } from "../components/Toast/ToastService";
// @ts-ignore
import useSound from "use-sound";

interface GlobalContext {
  auth: boolean;
  page: "login" | "settings" | "form" | "home";
  setPage: (page: "login" | "settings" | "form" | "home") => void;
  loading: boolean;
  token: string | null;
  openAIToken: string | null;
  getOpenAIToken: () => void;
  user: User | null;
  refreshUser: () => void;
  getUser: Function;
  setLoading: Function;
  summarizeNow: Function;
}

const globalContext = createContext<GlobalContext>({
  auth: false,
  page: "login",
  setPage: (page: "login" | "settings" | "form" | "home") => {},
  loading: false,
  setLoading: () => {},
  summarizeNow: (data: any) => {},
  token: null,
  openAIToken: null,
  getOpenAIToken: () => {},
  user: null,
  refreshUser: () => {},
  getUser: () => {},
});

interface GlobalContextProvider {
  children: ReactNode;
}

export function GlobalContextProvider({ children }: GlobalContextProvider) {
  const [auth, setAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<"login" | "settings" | "form" | "home">(
    "login"
  );
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [openAIToken, setOpenAIToken] = useState<string | null>(null);
  const toast = useToast();
  const [playOn] = useSound("./noti.mp3", { volume: 0.9 });

  const handleMessageListener = (message: Message<number | string>) => {
    setLoading(false);
    switch (message.type) {
      case "summarize-now":
        if (message.data.success) {
          toast.open("Summarize completed successfully!", 2000);
        } else {
          toast.open(`Summarize failed!`, 2000);
        }
        break;
      case "refresh-user":
        if (message.data.success) {
          setUser(message.data.user);
          setToken(message.data.token);
          toast.open("Data refresh success", 2000);
        }
        break;
      case "autofill-status":
        if (message.data.success) {
          toast.open("Form filled successfully", 2000);
          console.log("_____autofill-status__ success_______");
          playOn();
        }
        break;
      case "get-user":
        if (message.data.isAuth) {
          setAuth(true);
          setPage("home");
          setUser(message.data.user);
          setToken(message.data.token);
        } else {
          toast.open("Login required", 2000);
          setPage("login");
          setToken(null);
          setAuth(false);
          setUser(null);
        }
        break;
      case "authOpenAI":
        if (message.data.success) {
          setOpenAIToken(message.data.token);
        } else {
          toast.open(`OpenAI login failed ${message.data.error}`, 2000);
        }
        break;
      default:
        toast.open(message.data);
        console.error("incorrect message");
        break;
    }
  };

  useEffect(() => {
    chrome.runtime.onMessage.addListener(handleMessageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessageListener);
    };
  }, []);

  const contextValue = {
    auth,
    page,
    setPage: (page: "login" | "settings" | "form" | "home") => {
      setPage(page);
    },
    token,
    openAIToken,
    user,
    loading,
    setLoading,
    refreshUser: async () => {
      setLoading(true);
      const data = await sendMessage({
        type: "refresh-user",
        subtype: "refresh",
        data: {},
      });
      handleMessageListener(data);
    },
    getUser: async () => {
      const data = await sendMessage({
        type: "get-user",
        subtype: "get",
        data: {},
      });

      handleMessageListener(data);
    },
    summarizeNow: async (dataP: any) => {
      setLoading(true);
      const data = await sendMessage(dataP);
      handleMessageListener(data);
    },
    getOpenAIToken: async () => {
      const data = await sendMessage({
        type: "authOpenAI",
        subtype: "get",
        data: {},
      });

      handleMessageListener(data);
    },
  };
  return (
    <globalContext.Provider value={contextValue}>
      {children}
    </globalContext.Provider>
  );
}

export const useGlobalContext = () => {
  return useContext<GlobalContext>(globalContext);
};
