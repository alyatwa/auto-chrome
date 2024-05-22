import { constants } from "../utils/constants";

export default async function apiRequest(
  url: string,
  method = "GET",
  body: unknown = null,
  headers = {}
) {
  // Default options are marked with *
  const response = await fetch(constants.base_api_url + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      ...headers,
    },
    body: body ? JSON.stringify(body) : null, // body data type must match "Content-Type" header
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.status}`;
    throw new Error(message);
  }

  return response.json(); // parses JSON response into native JavaScript objects
}
