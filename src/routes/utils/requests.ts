import fetch, { RequestInit, HeadersInit } from "node-fetch";

export async function getRIOT(endpoint: string) {
  const options = createRiotOptions();

  return await getRequest(endpoint, options);
}

export async function getDB(endpoint: string, method: "GET" | "POST") {
  const options = createDBOptions(method);

  if (method === "POST") {
    return await postRequest(endpoint, options);
  }

  return await getRequest(endpoint, options);
}

async function getRequest(
  url: string,
  options: RequestInit,
) {
  const response = await fetch(url, options);
  
  if (!response.ok) throw new Error("Get request failed -> " + response.status);

  const data = await response.json();

  return data;
}

export async function postRequest(
  url: string,
  options: RequestInit,
  body?: any
) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Post request failed -> " + response.status);
  }
}

function createDBOptions(method: "GET" | "POST", body?: any) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  return {
    method,
    headers,
    body,
  };
}

function createRiotOptions() {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "X-Riot-Token": process.env.API_KEY as string,
  };

  return {
    method: "GET",
    headers,
  };
}
