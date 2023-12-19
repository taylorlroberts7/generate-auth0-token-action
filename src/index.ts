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
  // const request = require("request");

  // const jar = fetch.jar();
  // jar.setCookie(
  //   fetch.cookie(
  //     "did=s%253Av0%253A2536d630-b3a4-11e9-bf1c-0b33eec24f53.OA1zhcaw59Uxk%252FjxyV1r97x8UK9s6%252FHjaHW9%252FIP8T3s"
  //   ),
  //   `https://${process.env.PROD_AUTH0_DOMAIN}/oauth/token`
  // );
  const audience = core.getInput("audience");
  const clientId = core.getInput("client-id");
  const domain = core.getInput("domain");

  // * Optional inputs
  const clientSecret = core.getInput("client-secret") || undefined;
  const grantType = core.getInput("grant-type") || "client_credentials";
  const password = core.getInput("password") || undefined;
  const realm = core.getInput("realm") || undefined;
  const scope = core.getInput("scope") || undefined;
  const username = core.getInput("username") || undefined;

  const url = `https://${domain}/oauth/token`;
  const options = {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    form: {
      audience,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: grantType,
      password,
      realm,
      scope,
      username,
    },
    // jar: "JAR",
  };

  console.log("url -chk", url);
  console.log("options -chk", options);

  const response = await fetch(url, options);
  const data: any = await response.json();

  console.log("data -chk", data);
  const accessToken = data.access_token;

  if (!accessToken) {
    core.setFailed("Unable to retrieve access token");
  }

  core.setOutput("token", accessToken);
  return accessToken;

  // return new Promise((resolve, reject) => {
  //   request(options, function (error: Error, response, body) {
  //     if (error) reject(error);
  //     const { id_token } = JSON.parse(body);
  //     core.setOutput("token", id_token);
  //     return resolve(id_token);
  //   });
  //   // request(options, function (error: Error, response, body) {
  //   //   if (error) reject(error);
  //   //   const { id_token } = JSON.parse(body);
  //   //   core.setOutput("token", id_token);
  //   //   return resolve(id_token);
  //   // });
  // });
}
