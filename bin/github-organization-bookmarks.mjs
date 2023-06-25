#!/usr/bin/env node

/* eslint-disable max-len */
import "dotenv/config";

// Import Node.js Dependencies
import fs from "node:fs";
import { EOL } from "node:os";

// Import Third-party Dependencies
import { Headers, request } from "@myunisoft/httpie";
import pupa from "pupa";

// CONSTANTS
const kGitHubApiUrl = "https://api.github.com";
const kTimestamp = Date.now();

const orga = process.argv[2];
if (!orga) {
  throw new Error("Missing organization name");
}

const headers = new Headers({
  "X-GitHub-Api-Version": "2022-11-28"
});
const token = process.env.GITHUB_TOKEN;
if (token) {
  headers.set("Authorization", `Bearer ${token}`);
}
const { data: repos } = await request("GET",
  new URL(`/users/${orga}/repos?per_page=100`, kGitHubApiUrl),
  { headers }
);

const links = repos.map((repo) => `\t\t<DT><A HREF="${repo.html_url}" ADD_DATE="${kTimestamp}" LAST_MODIFIED="${kTimestamp}">${repo.name}</A>`).join(EOL);

const template = fs.readFileSync(new URL("../template.html", import.meta.url), "utf-8");
const bookmarks = pupa(template, { links, date: kTimestamp, orga });

fs.writeFileSync(`./${orga}.html`, bookmarks);
