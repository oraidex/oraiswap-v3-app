import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      poolOptions: {
        threads: {
          useAtomics: true
        }
      },
      globals: true,
      environment: 'happy-dom',
      setupFiles: './vitest.setup.ts',
      css: false
    }
  })
);
