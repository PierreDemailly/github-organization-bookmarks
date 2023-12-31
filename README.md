# github-organization-bookmarks

![version](https://img.shields.io/badge/dynamic/json.svg?style=for-the-badge&url=https://raw.githubusercontent.com/PierreDemailly/github-organization-bookmarks/main/package.json&query=$.version&label=Version)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://github.com/PierreDemailly/github-organization-bookmarks/graphs/commit-activity)
[![mit](https://img.shields.io/github/license/PierreDemailly/github-organization-bookmarks?style=for-the-badge)](https://github.com/PierreDemailly/github-organization-bookmarks/blob/main/LICENSE)

Generate bookmarks including all repositories in a GitHub organization.

## Requirements
- [Node.js](https://nodejs.org/en/) v16 or higher

## Getting Started

Go anywhere you want the bookmarks to be generated:

```bash
cd
mkdir myAwesomeBookmarks
cd myAwesomeBookmarks
```

Run the script, it will generate a `html` file.<br>
For instance, if you want to generate bookmarks for all repositories within **NodeSecure** organization:

```bash
npx github-organization-bookmarks NodeSecure
```

It will generate a `NodeSecure.html` file at `~/myAwesomeBookmarks` (or in the directory you ran the tool).

Go to [Chrome bookmarks](chrome://bookmarks/) and import the generated html file.

> **Note** Generated bookmarks should be compatible with most browsers.

> **Note** The tool fetch maximum 100 repositories

## Authentication

If you have access to private repositories in the GitHub organization (i.e, you are owner), you'll need to use a GitHub token to authenticate yourself.

Create a `.env`

```bash
touch .env
```

Add this following ENV variable

```bash
# GitHub access token
GITHUB_TOKEN=your_token
```

You can create a GitHub token [here](https://github.com/settings/tokens)

## Bookmark icons

Bookmarks are generated without icon for technical reason, your browser will automatically add it if you already visited the repositories.
Else, you can `Open all` your bookmark folder to open each repository, it will then add icons automatically.
