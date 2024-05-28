const base_api_url = "http://localhost:8000/api/autofill";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.message) {
    case "startAutofill":
      start(request.token, request.url);
      break;
    case "summarize-now-cs":
      injectResponse(request.data, sendResponse);
      break;
    default:
      sendResponse({ data: "Error: Not found message type" });
      break;
  }
});

const apiRequest = async (url, method = "GET", body = null, headers = {}) => {
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...headers,
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  return response.json(); // parses JSON response into native JavaScript objects
};

const start = (token, url) => {
  const inputs = getInputsInPage();
  generateValues(inputs, token, url);
};

const getInputsInPage = () => {
  const inputsObjects = [];
  const inputsHtml = [
    ...document.querySelectorAll(
      'input[type="text"], input[type="tel"], input[type="email"]'
    ),
    ...document.getElementsByTagName("textarea"),
  ];

  for (let i = 0; i < inputsHtml.length; i++) {
    const labelElementFor = document.querySelector(
      `label[for='${inputsHtml[i].id}']`
    )?.textContent;

    const labelElementSibling = inputsHtml[i].previousElementSibling;
    const labelSibling =
      labelElementSibling &&
      labelElementSibling.tagName.toLowerCase() === "label"
        ? labelElementSibling.textContent
        : null;

    const labelParent = inputsHtml[i]
      .closest("div")
      ?.querySelector("label")?.textContent;

    const divParent = inputsHtml[i]
      .closest("label")
      ?.querySelector("div")?.textContent;

    inputsObjects.push({
      id: inputsHtml[i].id,
      name: inputsHtml[i].name,
      type: inputsHtml[i].type,
      value: inputsHtml[i].value,
      label: labelElementFor || labelSibling || labelParent || divParent,
    });
  }
  return inputsObjects;
};

const generateValues = (inputs, token, url) => {
  let values = [];
  apiRequest(
    base_api_url,
    "POST",
    {
      url,
      inputs,
    },
    { Authorization: token }
  )
    .then((res) => {
      values = res.data;
      injectValues(res.data);
    })
    .catch((error) => {
      throw new Error("err in generateValues [content/index.js]", error);
    });
  return values;
};

const injectValues = (values) => {
  for (const key of values) {
    if (!key.input_name && !key.input_id) continue;

    const selector = key.input_name
      ? `[name='${key.input_name}']`
      : `[id='${key.input_id}']`;

    const input = document.querySelector(selector);

    // If the input exists, set its value to the value associated with the current key
    if (input) {
      input.focus();
      input.value = key.Input_value;
    }
  }
  sendConfirmation();
};

const sendConfirmation = () => {
  chrome.runtime.sendMessage(
    {
      type: "autofill-status",
      data: { success: true, msg: "Autofill completed successfully!" },
    },
    function (response) {
      // console.log(response);
    }
  );
};

const injectResponse = (data, sendResponse) => {
  console.log(data.response.data);
  var modal = document.createElement("div");
  modal.id = "AI-modal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100%";
  modal.style.height = "100%";
  modal.style.backgroundColor = "rgba(0,0,0,0.5)";
  modal.style.zIndex = "500";
  document.body.appendChild(modal);

  /** text content */
  var div = document.createElement("div");
  div.id = "AI-container";
  div.style.position = "fixed";
  div.className = "autofill-extension";
  div.style.top = "50%";
  div.style.left = "50%";
  div.style.border = "1px solid #181818";
  div.style.boxShadow = "0 0 10px 0 #00000070";
  div.style.padding = "20px";
  div.style.borderRadius = "23px";
  div.style.width = "500px";
  div.style.height = "500px";
  div.style.backgroundColor = "white";
  div.style.zIndex = "1000";
  div.style.overflowY = "auto";
  div.style.transform = "translate(-50%, -50%)";
  //div.textContent = JSON.stringify(data.response.data);
  modal.appendChild(div);

  const container = document.getElementById("AI-container");
  /** close */
  var close = document.createElement("span");
  close.textContent = "Close";
  close.style.fontSize = "16px";
  close.style.marginBottom = "10px";
  close.style.position = "absolute";
  close.style.top = "10px";
  close.style.right = "10px";
  close.style.cursor = "pointer";
  close.style.color = "red";
  close.addEventListener("click", () => {
    modal.remove();
  });
  container.appendChild(close);

  var title = document.createElement("div");
  title.id = "micro-ai";
  title.textContent = "Micro AI Tools";
  title.style.fontSize = "19px";
  title.style.color = "#181818";
  title.style.fontWeight = "bold";
  title.style.marginBottom = "20px";
  container.appendChild(title);

  const box = document.createElement("div");
  box.style.marginTop = "20px";
  box.style.display = "flex";
  box.style.flexDirection = "column";
  box.style.gap = "2px";
  container.appendChild(box);

  box.innerHTML = `<p style="margin-bottom:8px;">${data.response.data}</p>`;
  /* Object.entries(data.response.data).forEach(([key, value]) => {
    const div = document.createElement("div");
    div.textContent = `${key}: ${value}`;
    container.appendChild(div);
  }); */
  sendResponse("injected content");
};
