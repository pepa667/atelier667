# GitHub Project Board Integration (Vite Build Asset Pipeline)

This repository includes a custom, zero-dependency inline Vite plugin that automatically connects with GitHub's GraphQL API (v4) during compilation. Every time you build the production site, it pulls live cards directly from a profile-level project layout and compiles them down to a static data asset.

This eliminates runtime token exposure, entirely bypasses client-side GitHub API rate limits, and speeds up page performance.

---

## 🛠️ How It Works

1. **Build Step Triggered:** You execute `npm run build`.
2. **GraphQL Evaluation:** The custom inline plugin queries the specific profile project board data from GitHub.
3. **Asset Compilation:** The plugin transforms the raw payload data and emits an automated, structured asset straight into your build directory at `dist/github-board.json`.
4. **Hydration:** Your client-side JavaScript reads this clean local file asynchronously to map the Kanban design grid onto your layout.

---

## 📦 Setting Up the Configuration (`vite.config.js`)

Add the custom generation hook module into your existing Vite config arrangement:

```javascript
import { defineConfig } from 'vite';

function vitePluginFetchUserProject() {
  const USERNAME = 'pepa667';
  const PROJECT_NUMBER = 2; // Derived from https://github.com
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

  return {
    name: 'vite-plugin-fetch-user-project',
    async generateBundle() {
      if (!GITHUB_TOKEN) {
        console.warn('⚠️ Vite GitHub Plugin skipped: Missing GITHUB_TOKEN environment variable.');
        return;
      }

      console.log(`Fetching GraphQL Project v2 data for user: ${USERNAME}...`);

      const query = `
        query($username: String!, $number: Int!) {
          user(login: $username) {
            projectV2(number: $number) {
              items(first: 100) {
                nodes {
                  id
                  content {
                    ... on Issue { title number url state }
                    ... on PullRequest { title number url state }
                  }
                  fieldValues(first: 10) {
                    nodes {
                      ... on ProjectV2ItemFieldSingleSelectValue {
                        name
                        field { ... on ProjectV2FieldCommon { name } }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;

      try {
        const response = await fetch('https://github.com', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'User-Agent': 'Vite-GraphQL-Plugin',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query, variables: { username: USERNAME, number: PROJECT_NUMBER } })
        });

        const result = await response.json();
        if (result.errors) throw new Error(JSON.stringify(result.errors));

        const projectItems = result.data.user.projectV2.items.nodes;
        const boardData = { todo: [], inProgress: [], done: [] };

        projectItems.forEach(item => {
          if (!item.content) return; // Skips empty draft items

          const card = {
            id: item.id,
            title: item.content.title,
            number: item.content.number,
            url: item.content.url,
            type: item.content.__typename
          };

          const statusField = item.fieldValues.nodes.find(f => f.field?.name === 'Status');
          const currentStatus = statusField ? statusField.name.toLowerCase() : 'todo';

          if (currentStatus === 'in progress') {
            boardData.inProgress.push(card);
          } else if (currentStatus === 'done') {
            boardData.done.push(card);
          } else {
            boardData.todo.push(card);
          }
        });

        this.emitFile({
          type: 'asset',
          fileName: 'github-board.json',
          source: JSON.stringify(boardData, null, 2)
        });

        console.log('✅ Successfully generated "dist/github-board.json"');
      } catch (error) {
        console.error('❌ GraphQL Fetch Exception during Vite build:', error);
      }
    }
  };
}

export default defineConfig({
  plugins: [vitePluginFetchUserProject()]
});
```

---

## 🔑 Environment Secrets Setup

To access a personal project profile page, you need to authenticate using a **GitHub Personal Access Token (PAT)**.

1. Head to your GitHub profile settings: **Settings** > **Developer Settings** > **Personal Access Tokens (Tokens classic)**.
2. Generate a new token checking the **`read:project`** scope scope access.
3. Pass this generated secret key when triggering your build routine inside local environment scopes or hosting platform configurations (Vercel, Netlify, Cloudflare Pages):

```bash
# Executing standard local pipeline builds manually
GITHUB_TOKEN=ghp_yourActualSecretTokenHere npm run build
```

---

## 🛜 Client Hydration Example (HTML/JS)

Once Vite publishes your static application layout files, `github-board.json` sits natively beside your homepage asset. Access and distribute the items cleanly inside your client script:

```html
<div class="kanban-wrapper">
  <div id="todo-list"></div>
  <div id="progress-list"></div>
  <div id="done-list"></div>
</div>

<script>
  async function loadBoardAsset() {
    try {
      const response = await fetch('/github-board.json');
      const data = await response.json();
  
      // Render columns loop logic
      data.inProgress.forEach(card => {
        const item = document.createElement('p');
        item.innerHTML = `<a href="${card.url}" target="_blank">${card.title}</a>`;
        document.getElementById('progress-list').appendChild(item);
      });
    } catch (err) {
      console.error("Failed loading local JSON static file data source layout", err);
    }
  }
  document.addEventListener('DOMContentLoaded', loadBoardAsset);
</script>
```

---

## 🚀 Free Automated Deployments on Netlify

Because Netlify's free tier caps compilation budgets at **300 build minutes per month**, building a dynamic site every single day directly on Netlify's servers will drain your credits. 

To keep this site **100% free**, we use a hybrid pipeline: **GitHub Actions** runs the daily scheduled data harvest (using your 2,000 free minutes), builds the Vite application, and pushes the final raw code straight to Netlify using the Netlify CLI. This keeps Netlify's build engine completely idle.

### 📋 Setup & Authentication

1. **Get your Netlify Site ID**: Head to your Netlify dashboard, select your site, and navigate to **Site configuration** > **Site details** > Copy your **Site ID**.
2. **Get your Netlify Access Token**: Click your profile avatar at the top right of Netlify > **User settings** > **Applications** > **Personal access tokens** > Generate a **New access token**.
3. **Save Your Repository Secrets**: Go to your GitHub Repository > **Settings** > **Secrets and variables** > **Actions** and add the following three secrets:
   * `MY_PROJECT_SECRET_TOKEN` (Your GitHub Classic Personal Access Token with `read:project` scope)
   * `NETLIFY_SITE_ID` (Your Netlify Site ID)
   * `NETLIFY_AUTH_TOKEN` (Your Netlify Personal Access Token)

### 🗂️ Configuration File (`.github/workflows/deploy.yml`)

Create a file named `.github/workflows/deploy.yml` in your codebase and paste this production workflow:

```yaml
name: Rebuild and Deploy Website

on:
  # Triggers exactly once a day at midnight UTC
  schedule:
    - cron: '0 0 * * *'
    
  # Triggers instantly whenever you update the codebase
  push:
    branches:
      - main

  # Allows manual data sync directly from the GitHub Actions tab
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Compile Vite Static Bundle
        env:
          GITHUB_TOKEN: \${{ secrets.MY_PROJECT_SECRET_TOKEN }}
        run: npm run build

      - name: Deploy Compiled Assets to Netlify
        uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: './dist'
          production-deploy: true
          github-token: \${{ secrets.GITHUB_TOKEN }}
        env:
          NETLIFY_SITE_ID: \${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: \${{ secrets.NETLIFY_AUTH_TOKEN }}
```
