import { config } from "../config";
import type { AnyObject } from "../types";

export async function query(
  api: string,
  params: AnyObject<string | AnyObject>
) {
  const url = config.get(api);
  // send post to url with params
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(params),
    mode: "cors",
  });
  return await response.json();
}

export async function queryAsync(api: string, params: AnyObject) {
  const url = config.get(api);
  // send post to url with params
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(params),
    mode: "cors",
  });
  const json = await response.json();
  return json;
}
