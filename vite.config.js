import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { marked } from 'marked'
import { parseProjectFile } from './scripts/lib/projectFile.js'

// Compiles content/projects/*.md into { ...frontmatter, html: { overview, problem, ... } } at build time.
// Private projects ship without their case-study body (it's served by /api/unlock instead).
function projectContent() {
  return {
    name: 'project-content',
    transform(source, id) {
      const file = id.replace(/\\/g, '/');
      if (!/\/content\/projects\/[^/]+\.md$/.test(file)) return null;
      const { data, sections } = parseProjectFile(source, file.split('/').pop());
      const html = data.private
        ? {}
        : Object.fromEntries(Object.entries(sections).map(([key, md]) => [key, marked.parse(md)]));
      return { code: `export default ${JSON.stringify({ ...data, html })};`, map: null };
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [projectContent(), react()],
  // Fixed port: Sanity only answers origins on its CORS allow-list (sanity.io/manage -> API -> CORS origins).
  server: { port: 5174, strictPort: true },
})
