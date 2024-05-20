import "./App.css";
import Home from "./pages/Home";

import "./reset.css";

function App() {
  return (
    <>
      <div className="flex flex-row items-center justify-center p-2 w-[300px] h-[400px] bg-[#0b2938]">
        <div className="flex flex-col gap-4 justify-between items-center bg-white rounded-xl w-full h-full">
          <Home />
          <footer className="p-2.5 w-full h-[50px]">
            <div className="flex flex-row h-full w-full items-center text-xs text-[#0b2938] border-t border-solid  border-[#0b2938]">
              Your current Plan
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export default App;
