
import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import { AcmeCombobox } from '@ds-angular';
import { renderTwoWayBinding, StoryHtmlType } from 'src/helpers/stories.helpers';
import btn from '../../../../packages/ds-css/src/components/btn.cva'

type StoryHtml = StoryHtmlType<typeof btn>;



// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<AcmeCombobox> = {
    title: 'Example/AcmeCombobox',
    component: AcmeCombobox,
    tags: ['autodocs'],
    parameters: {
        badge: 'test',
    },
    argTypes: {},
    render: renderTwoWayBinding('acme-combobox', ['value']),

};

export default meta;


type Story = StoryObj<AcmeCombobox>;

export const Basic: Story = {
    args: {
        placeholder: 'Select an option',
        disabled: false,
        search: false,
        options: [
            'Option 1',
            'Option 2',
            'Option 3',
        ]
    },
};

export const Searchable: Story = {
    parameters: {

    },
    args: {
        placeholder: 'Select an option',
        disabled: false,
        search: true,
        value: 'Option 2',
        options: [
            'Option 1',
            'Option 2',
            'Option 3',
        ]
    },

};

export const BasicHtml: StoryHtml = {
    parameters: {
        controls: {
            exclude: /.*/g
        }
    },
    render: (args) => ({
        props: args,
        template: `<div class="acme-combobox">
            <div>Select an option salut</div>
        </div>`,
    }),
};

