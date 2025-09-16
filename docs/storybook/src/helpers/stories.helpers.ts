import { cva } from "class-variance-authority";
import type { StoryObj } from '@storybook/angular';
import type { VariantProps } from "class-variance-authority";

export type StoryHtmlType<T extends ReturnType<typeof cva>> = StoryObj<VariantProps<T>>;

