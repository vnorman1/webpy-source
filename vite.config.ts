import path from 'path';
import { defineConfig} from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig(() => {
    return {
      plugins: [tailwindcss()],
      base: './webpy/',
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
