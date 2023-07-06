import fetch, { RequestInit, HeadersInit } from "node-fetch";

export async function getRequest(
  url: string,
  isApiKeyNeeded = false,
  hasToTrowException = true
) {
  const options = createOptions("GET", null, isApiKeyNeeded);

  try {
    const response = await fetch(url, options);
    if (!response.ok) handleError(response.status, hasToTrowException);

    const data = await response.json();

    return data;
  } catch (err) {}
}

export async function postRequest(url: string, action: string, body: any) {
  const options = createOptions("POST", body);

  const response = await fetch(url + action, options);
  if (!response.ok){
    throw new Error("Post request failed -> " + response.status);
  };
}

function handleError(statusCode: number, hasToTrowException: boolean) {
  if (!hasToTrowException) {
    return null;
  }

  const errMsg = getErrMsg(statusCode);

  throw new Error(errMsg);
}

function getErrMsg(statusCode: number) {
  let errMsg = "Api call failed -> ";

  const errMsgs: { [key: number]: string } = {
    400: "Bad request, check the queries",
    401: "Unauthorized, check your API key",
    403: "Forbidden, check your API key",
    404: "Data not found, check the queries",
    429: "Rate limit exceeded, wait 3 minutes maximum and try again",
  };

  errMsg += errMsgs[statusCode] || "Unknown error";

  return errMsg;
}

function createOptions(
  method: "GET" | "POST",
  body?: any,
  isApiKeyNeeded?: boolean
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (isApiKeyNeeded) {
    headers["X-Riot-Token"] = process.env.API_KEY as string;
  }

  const options: RequestInit = {
    method,
    headers,
    body,
  };

  return options;
}
