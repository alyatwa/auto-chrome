export const autoFillForm = (data: Input[]) => {
  // Iterate over the keys in the data object
  for (const key of data) {
    if (!key.name && !key.id) continue;

    const selector = key.name ? `[name="${key.name}"]` : `[id="${key.id}"]`;
    const input = document.querySelector(selector) as
      | HTMLInputElement
      | HTMLTextAreaElement
      | null;

    // If the input exists, set its value to the value associated with the current key
    if (input) {
      input.value = key.value;
    }
  }
};
