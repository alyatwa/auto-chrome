import { useEffect } from "react";
import "./App.css";
import Form from "./pages/Form";
import Login from "./pages/Login";
import "./reset.css";
import { useGlobalContext } from "./store/chromeStore";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

function App() {
  const { getUser, auth, page, loading } = useGlobalContext();
  useEffect(() => {
    getUser();
  }, []);
  const Page = () => {
    switch (page) {
      case "home":
        return <Home />;
      case "form":
        return <Form />;
      case "settings":
        return <Settings />;
      case "login" || !auth:
        return <Login />;
      default:
        return <Login />;
    }
  };

  return (
    <div className={`p-2 w-[300px] h-[400px] ${loading ? "" : "bg-[#0b2938]"}`}>
      <div
        className={`flex flex-col items-center justify-center h-full  rounded-xl ${
          loading ? "glow" : ""
        }`}
      >
        {page != "login" ? <Header /> : null}
        <main className="flex flex-col gap-4 justify-between items-center bg-white w-full h-full ">
          {Page()}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;
