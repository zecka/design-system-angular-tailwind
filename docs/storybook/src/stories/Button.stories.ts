
import type { Meta, StoryObj } from '@storybook/angular';
import { componentWrapperDecorator } from '@storybook/angular';
import { AcmeButton as ButtonComponent } from '@acme/ds-angular';
import { storyHtml, StoryHtmlType } from 'src/helpers/stories.helpers';
import btn from '../../../../packages/ds-css/src/components/btn.cva'




// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta: Meta<ButtonComponent> = {
  title: 'Example/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  decorators: [
    componentWrapperDecorator((story) => `${story}`),
  ],
  argTypes: {},
};

export default meta;


type Story = StoryObj<ButtonComponent>;
export const Basic: Story = {
  args: {
  },
};

export const HtmlButton = storyHtml({
  render: (args) => ({
    props: args,
    template: `<button class="btn ${btn({ intent: args.intent })}">TEsST</button>`,
  }),
  args: {
    intent: 'secondary',
    size: 'sm',
    disabled: false,
  },
}, btn);

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
  args: {
    intent: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    intent: 'secondary',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};
