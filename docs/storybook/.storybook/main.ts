import type { StorybookConfig } from '@storybook/angular';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    './addons/toolbar-addon.js'
  ],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  webpackFinal: async (cfg) => {
    cfg.resolve = cfg.resolve || {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias || {}),
      '@ds-angular': path.resolve(__dirname, '../../../packages/ds-angular/projects/design-system/src/public-api.ts'),
    };
    return cfg;
  },
};
export default config;
