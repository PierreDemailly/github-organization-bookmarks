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
const kGitHubIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABeklEQVQ4jY3Tv2qVQRAF8PPdP7k3itoE7SOIKFZiDAZsfBJFfBDRQjBFGkFiJ/gKerGwsRAsvaKFFhYWgo3GxEA0P4vMhTUk4sDy7c6cMztzZr9kn2EFD/Eem7Xele/yfnxLnMP9Isxst9bMfhRmriX2MMLE/9ukOL1ZktUKvMANvMIGpnhT+9e4jmeFvTcjL2ELv7BevjFOYYgBFjBfsbXCbuLiIMnNJPPV0Tb6XddtJ9luJPqKDv0kO0n6SY4kuZVSeBc/cabRpWt06mZnLJaYu5im+oPPGB06pr9Fn1aCjV6SYcWOJhm3Nx9A7pKMkywk6ZIMe0k+JJHkRJLlruugf0ALg67rJFlJcrI4H4NHVc53fMLZf1RwDm/xu9peD5brcBuPa/8cSw3xAp7gW8V3apSXZoC1quI87uApTjcJFptXuFXf1VbVPl7WSK+1txdmjC9Nkom9f6fXggZ40ICON7Fj1feOvWc/zGGGK9XGqPGNcBdX9+P/AO1cPr7g2LjWAAAAAElFTkSuQmCC";
const kGitHubApiUrl = "https://api.github.com";
const kTimestamp = Date.now();

const orga = process.argv[2];
const token = process.env.GITHUB_TOKEN;
if (!orga) {
  throw new Error("Missing organization name");
}

const template = fs.readFileSync(new URL("../template.html", import.meta.url), "utf-8");
const headers = new Headers({
  "X-GitHub-Api-Version": "2022-11-28"
});
if (token) {
  headers.set("Authorization", `Bearer ${token}`);
}
const { data: repos } = await request(
  "GET",
  new URL(`/users/${orga}/repos?per_page=100`, kGitHubApiUrl),
  {
    headers
  }
);

const links = repos.map((repo) => `\t\t<DT><A HREF="${repo.html_url}" ADD_DATE="${kTimestamp}" LAST_MODIFIED="${kTimestamp}" ICON="${kGitHubIcon}">${repo.name}</A>`).join(EOL);

const bookmarks = pupa(template, { links, date: kTimestamp, orga });

fs.writeFileSync(`./${orga}.html`, bookmarks);
