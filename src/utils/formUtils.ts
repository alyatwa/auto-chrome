export const autoFillForm = (da?: any) => {
  // Iterate over the keys in the data object
  const data = [
    {
      input_name: "firstname",
      input_id: "firstname",
      Input_value: "Administrator",
    },
  ];
  for (const key of data) {
    if (!key.input_name && !key.input_id) continue;

    const selector = key.input_name
      ? `[name='${key.input_name}']`
      : `[id='${key.input_id}']`;

    const input = document.querySelector(selector) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;

    // If the input exists, set its value to the value associated with the current key
    if (input) {
      input.value = key.Input_value;
    }
  }
};
