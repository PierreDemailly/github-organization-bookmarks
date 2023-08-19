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
const kRequestOptions = {
  headers: new Headers({
    "X-GitHub-Api-Version": "2022-11-28"
  }),
  authorization: process.env.GITHUB_TOKEN
};
const kOrganization = process.argv[2];

if (!kOrganization) {
  throw new Error("Missing organization name");
}

const requestUrl = new URL(`/users/${kOrganization}/repos?per_page=100`, kGitHubApiUrl);
const { data: repos } = await request("GET", requestUrl, kRequestOptions);
const promises = repos.map(async(repo) => {
  try {
    // Note: GitHub automatically handle the main branch when given master (if main instead of master).
    const { data } = await request("GET", `https://raw.githubusercontent.com/${repo.full_name}/master/package.json`);
    const packageJson = JSON.parse(data);

    if (packageJson.workspaces) {
      return { ...repo, workspaces: packageJson.workspaces };
    }
  }
  catch {
    // Do nothing, there is no package.json in the repo
  }

  return repo;
});
const repoWithWorkspaces = await Promise.all(promises);

const links = repoWithWorkspaces.map((repo) => {
  if (!repo.workspaces) {
    return `\t\t<DT><A HREF="${repo.html_url}" ADD_DATE="${kTimestamp}" LAST_MODIFIED="${kTimestamp}">${repo.name}</A>`;
  }

  const workspaceFolder = [
    `\t\t<DT><H3 ADD_DATE="${kTimestamp}" LAST_MODIFIED="${kTimestamp}">${repo.name}</H3>`,
    "\t\t<DL><p>",
    `\t\t\t<DT><A HREF="${repo.html_url}" ADD_DATE="${kTimestamp}" LAST_MODIFIED="${kTimestamp}">${repo.name}</A>`
  ];

  for (const workspace of repo.workspaces) {
    const workspaceHtmlUrl = new URL(workspace, repo.html_url + "/");
    workspaceFolder.push(
      `\t\t\t<DT><A HREF="${workspaceHtmlUrl}" ADD_DATE="${kTimestamp}" LAST_MODIFIED="${kTimestamp}">${workspace}</A>`
    );
  }
  workspaceFolder.push(
    "\t\t</DL><p>"
  );

  return workspaceFolder.join(EOL);
}).join(EOL);

const template = fs.readFileSync(new URL("../template.html", import.meta.url), "utf-8");
const bookmarks = pupa(template, { links, date: kTimestamp, orga: kOrganization });

fs.writeFileSync(`./${kOrganization}.html`, bookmarks);
