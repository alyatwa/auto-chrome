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
  user: User | null;
  getUser: Function;
  setLoading: Function;
}

const globalContext = createContext<GlobalContext>({
  auth: false,
  page: "login",
  setPage: (page: "login" | "settings" | "form" | "home") => {},
  loading: false,
  setLoading: () => {},
  token: null,
  user: null,
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
  const toast = useToast();
  const [playOn] = useSound("./noti.mp3", { volume: 0.9 });

  const handleMessageListener = (message: Message<number | string>) => {
    setLoading(false);
    switch (message.type) {
      case "autofill-status":
        if (message.data.success) {
          toast.open("Form filled successfully", 2000);
          console.log("_____autofill-status__ success_______");
          playOn();
        }
        // Handle review, reviewHandler(message, setReview) | review = reviewHandler(message) -> state in the handler
        break;
      case "get-user":
        // For simplicity, assume only message language received by content script is the new language selection
        if (message.data.isAuth) {
          setAuth(true);
          setPage("home");
          setUser(message.data.user);
          setToken(message.data.token);
        } else {
          setPage("login");
          setToken(null);
          setAuth(false);
          setUser(null);
        }
        break;
      default:
        console.error("incorrect message"); // Up to you how you handle the error case
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
    user,
    loading,
    setLoading,
    getUser: async () => {
      const data = await sendMessage({
        type: "get-user",
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
