import viteTsConfigPaths from 'vite-tsconfig-paths';
import { UserConfig, mergeConfig } from 'vite';

import type { StorybookConfig } from '@analogjs/storybook-angular';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
  ],
  staticDirs: ['../public'],
  framework: {
    name: '@analogjs/storybook-angular',
    options: {},
  },
  async viteFinal(config: UserConfig) {


    return mergeConfig(config, {
      server: {
        watch: {
          usePolling: true
        }
      },
      plugins: [viteTsConfigPaths(), (await import('@tailwindcss/vite')).default()],
    });
  },
};
export default config;
