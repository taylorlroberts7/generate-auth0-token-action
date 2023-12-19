import * as core from "@actions/core";
import fetch from "node-fetch";

async function run() {
  try {
    const token = await getAuthToken();
    core.exportVariable("AUTH0_ACCESS_TOKEN", token);
    core.setSecret("AUTH0_ACCESS_TOKEN");
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

run();

async function getAuthToken() {
  const audience = core.getInput("audience");
  const clientId = core.getInput("client-id");
  const domain = core.getInput("domain");

  // * Optional inputs
  const clientSecret = core.getInput("client-secret") || undefined;
  const grantType = core.getInput("grant-type") || undefined;
  const password = core.getInput("password") || undefined;
  const realm = core.getInput("realm") || undefined;
  const scope = core.getInput("scope") || undefined;
  const username = core.getInput("username") || undefined;

  const url = `https://${domain}/oauth/token`;
  const inputs = {
    audience,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: grantType,
    password,
    realm,
    scope,
    username,
  };

  const requestBody: { [x: string]: string } = {};

  let key: keyof typeof inputs;
  for (key in inputs) {
    if (!!inputs[key]) {
      requestBody[key] = inputs[key] as string;
    }
  }

  const options = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(requestBody),
  };

  core.debug(`Request options: JSON.stringify(options)`);

  const response = await fetch(url, options);

  core.debug(`Response: ${JSON.stringify(response)}`);

  const data: any = await response.json();

  core.debug(`Response.json: ${JSON.stringify(data)}`);

  const accessToken = data.access_token;

  if (!accessToken) {
    core.setFailed("Unable to retrieve access token");
  }

  core.setOutput("token", accessToken);
  return accessToken;
}
