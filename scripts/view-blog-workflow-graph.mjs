import { execFile } from 'node:child_process';
import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { promisify } from 'node:util';

import { createBlogWorkflowGraph } from '../.codex/workflows/blog_workflow_graph.mjs';

const execFileAsync = promisify(execFile);
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const mermaidScriptUrl = pathToFileURL(
  join(scriptDirectory, '../node_modules/mermaid/dist/mermaid.min.js')
).href;

const graph = await createBlogWorkflowGraph().getGraphAsync();
const mermaid = graph
  .drawMermaid()
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');
const outputPath = join(scriptDirectory, '../.codex/blog-workflow-graph.html');

const html = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>블로그 포스팅 워크플로 그래프</title>
    <style>
      body { margin: 0; padding: 32px; background: #fff; }
      .mermaid { display: flex; justify-content: center; }
    </style>
  </head>
  <body>
    <pre class="mermaid">${mermaid}</pre>
    <script src="${mermaidScriptUrl}"></script>
    <script>mermaid.initialize({ startOnLoad: true });</script>
  </body>
</html>
`;

await writeFile(outputPath, html, 'utf8');
await execFileAsync('open', [outputPath]);

console.log(`블로그 포스팅 워크플로 그래프를 열었습니다: ${outputPath}`);
