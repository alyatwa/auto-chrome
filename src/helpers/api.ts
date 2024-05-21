export default async function apiRequest(
  url: string,
  method = "GET",
  body: unknown = null,
  headers = {}
) {
  // Default options are marked with *
  const response = await fetch("https://localhost:8000/api/" + url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
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
