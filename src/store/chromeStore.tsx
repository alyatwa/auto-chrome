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
  loading: boolean;
  token: string | null;
  user: User | null;
  getUser: Function;
  setLoading: Function;
}

const globalContext = createContext<GlobalContext>({
  auth: false,
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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const toast = useToast();
  const [playOn] = useSound("./noti.mp3", { volume: 0.9 });

  const handleMessageListener = (message: Message<number | string>) => {
    setLoading(false);
    switch (message.type) {
      case "autofill-status":
        console.log("________autofill-status_________");
        if (message.data.success) {
          toast.open("Form filled successfully", 2000);
          playOn();
        }
        // Handle review, reviewHandler(message, setReview) | review = reviewHandler(message) -> state in the handler
        break;
      case "get-user":
        // For simplicity, assume only message language received by content script is the new language selection
        if (message.data.isAuth) {
          setAuth(true);
          setUser(message.data.user);
          setToken(message.data.token);
        } else {
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
