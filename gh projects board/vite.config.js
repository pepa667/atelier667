import { defineConfig } from 'vite';

function vitePluginFetchUserProject() {
    const USERNAME = 'pepa667';
    const PROJECT_NUMBER = 2; // Derived from /projects/2

    // A Personal Access Token is REQUIRED for GitHub GraphQL v4 requests
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'YOUR_PERSONAL_ACCESS_TOKEN_HERE';

    return {
        name: 'vite-plugin-fetch-user-project',
        async generateBundle() {
            if (!GITHUB_TOKEN || GITHUB_TOKEN.startsWith('YOUR_')) {
                console.error('⚠️ Vite GitHub Plugin skipped: Missing a valid GITHUB_TOKEN.');
                return;
            }

            console.log(`Fetching GraphQL Project v2 data for user: ${USERNAME}...`);

            // GraphQL payload targeted to your specific user project structure
            const query = `
        query($username: String!, $number: Int!) {
          user(login: $username) {
            projectV2(number: $number) {
              title
              items(first: 100) {
                nodes {
                  id
                  content {
                    ... on Issue {
                      title
                      number
                      url
                      state
                    }
                    ... on PullRequest {
                      title
                      number
                      url
                      state
                    }
                  }
                  # Fetches custom columns like Status (Todo, In Progress, Done)
                  fieldValues(first: 10) {
                    nodes {
                      ... on ProjectV2ItemFieldSingleSelectValue {
                        name
                        field {
                          ... on ProjectV2FieldCommon {
                            name
                          }
                        }
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
                    body: JSON.stringify({
                        query,
                        variables: { username: USERNAME, number: PROJECT_NUMBER }
                    })
                });

                const result = await response.json();

                if (result.errors) {
                    throw new Error(JSON.stringify(result.errors));
                }

                const projectItems = result.data.user.projectV2.items.nodes;

                // Process items and sort them based on their "Status" field column value
                const boardData = { todo: [], inProgress: [], done: [] };

                projectItems.forEach(item => {
                    if (!item.content) return; // Skips raw draft notes if any

                    const card = {
                        id: item.id,
                        title: item.content.title,
                        number: item.content.number,
                        url: item.content.url,
                        type: item.content.__typename // Tells you if it's an Issue or PullRequest
                    };

                    // Identify which status column the card belongs to
                    const statusField = item.fieldValues.nodes.find(f => f.field?.name === 'Status');
                    const currentStatus = statusField ? statusField.name.toLowerCase() : 'todo';

                    if (currentStatus === 'in progress') {
                        boardData.inProgress.push(card);
                    } else if (currentStatus === 'done' || card.state === 'CLOSED') {
                        boardData.done.push(card);
                    } else {
                        boardData.todo.push(card);
                    }
                });

                // Emit JSON block matching your dashboard architecture
                this.emitFile({
                    type: 'asset',
                    fileName: 'github-board.json',
                    source: JSON.stringify(boardData, null, 2)
                });

                console.log('✅ Successfully generated user project data to dist/github-board.json!');
            } catch (error) {
                console.error('❌ GraphQL Fetch Exception during Vite build:', error);
            }
        }
    };
}

export default defineConfig({
    plugins: [vitePluginFetchUserProject()]
});
