const base_api_url = "http://localhost:8000/api/";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "startAutofill") {
    start(request.token);
  }
});

const apiRequest = async (url, method = "GET", body = null, headers = {}) => {
  const response = await fetch(base_api_url + url, {
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

const start = (token) => {
  const inputs = getInputsInPage();
  const values = generateValues(inputs, token);
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

const generateValues = (inputs, token) => {
  console.log(inputs, token);
  let values = [];
  apiRequest(
    "autofill",
    "POST",
    {
      url: "-",
      inputs: inputs,
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
      console.log(response);
    }
  );
};
