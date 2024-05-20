import Button from "../../components/UI/Button";

const Home: React.FC = () => {
  const fillForm = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];

      function printTitle() {
        const resultStr = "doc title: " + document.title;
        console.log(resultStr);

        // https://developer.chrome.com/docs/extensions/mv3/messaging/
        (async () => {
          const response = await chrome.runtime.sendMessage({
            info: resultStr,
          });
          // do something with response here, not outside the function
          console.log(response);
        })();

        //return resultStr;
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
  if (chrome.runtime) {
    chrome.runtime.onMessage.addListener(function (request, sender) {
      console.log(
        sender.tab
          ? "from a content script: " + sender.tab.url
          : "from the extension"
      );
      const resp = request.info;
      if (resp) {
        //document.getElementById("result").innerText = resp;
        //sendResponse({farewell: "thanks for sending! goodbye"});
      }
    });
  }
  return (
    <div className="flex flex-row justify-center items-center w-full h-full">
      <Button onClick={() => fillForm()}>Fill</Button>
    </div>
  );
};
export default Home;
