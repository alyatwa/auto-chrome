import "./App.css";
import "./reset.css";

function App() {
  const fillForm = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      function printTitle() {
        const title = document.title;
        console.log(title);
      }

      chrome.scripting
        .executeScript({
          target: { tabId: tab.id ?? 0 },
          func: printTitle,
          //        files: ['contentScript.js'],  // To call external file instead
        })
        .then(() => console.log("Injected a function!"));
    });
  };

  return (
    <>
      <div className="flex flex-row items-center justify-center w-full h-full bg-green-700">
        <button
          className="bg-yellow-400 text-white rounded-lg px-4 py-2"
          onClick={() => fillForm()}
        >
          Fill
        </button>
      </div>
    </>
  );
}

export default App;
