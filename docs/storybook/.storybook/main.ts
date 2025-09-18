import type { StorybookConfig } from '@storybook/angular';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
  ],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  webpackFinal: async (cfg) => {
    cfg.module = cfg.module || {};
    cfg.module.rules = cfg.module.rules || [];
    cfg.module.rules.push({
      test: /\.css$/,
      include: [
        path.resolve(__dirname, "../src"), // adapte si besoin
        path.resolve(__dirname, "../../../packages/ds-tokens/build/css"),
      ],
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: { importLoaders: 1 },
        },
        {
          loader: "postcss-loader",
          options: {
            postcssOptions: {
              plugins: [
                require("tailwindcss"),
                require("autoprefixer"),
              ],
            },
          },
        },
      ],
    });


    cfg.module.rules.push({
      test: /\.css$/,
      include: path.resolve(__dirname, '../src'),
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: { importLoaders: 1 },
        },
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              plugins: [require('@tailwindcss/postcss')],
            },
          },
        },
      ],
    });
    cfg.resolve = cfg.resolve || {};
    cfg.resolve.alias = {
      ...(cfg.resolve.alias || {}),
      '@ds-angular': path.resolve(__dirname, '../../../packages/ds-angular/projects/design-system/src/public-api.ts'),
    };
    return cfg;
  },
};
export default config;
