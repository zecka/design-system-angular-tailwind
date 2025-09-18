import { cva } from "class-variance-authority";
import type { StoryObj } from '@storybook/angular';
import type { VariantProps } from "class-variance-authority";

export type StoryHtmlType<T extends ReturnType<typeof cva>> = StoryObj<VariantProps<T>>;

export const storyHtml = <T extends ReturnType<typeof cva>>(args: StoryHtmlType<T>, cva?: T,) => {
    return {
        parameters: {
            controls: {
                exclude: /.*/g,
                ...args.parameters?.['controls']
            },
            ...args.parameters
        },
        ...args,
    } satisfies StoryObj<VariantProps<T>>;
};


export const renderArgsWithModel = <T extends object>(args: T, modelArgs: string[]) => {
    const result = Object.keys(args).map(key => {
        if (modelArgs.includes(key)) {
            return `[(${key})]="${key}"`;
        }
        const value = args[key as keyof T];
        if (['string'].includes(typeof value)) {
            return `${key}="${value}"`;
        }
        if (typeof value === 'boolean' && value === true) {
            return key;
        }
        if (['number', 'boolean'].includes(typeof value)) {
            return `[${key}]="${value}"`;
        }
        return `[${key}]="${key}"`;
    }).join(' ');
    console.log('renderArgsWithModel', result);
    return result;
}

export const renderTwoWayBinding = (selector: string, modelArgs: string[]): StoryObj<any>['render'] => (args: object) => ({
    props: args,
    template: `<${selector} ${renderArgsWithModel(args, modelArgs)}></${selector}>`,
});