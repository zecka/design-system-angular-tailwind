import { AcmeCombobox } from '@acme/ds-angular';
import { Meta, StoryObj, applicationConfig } from '@storybook/angular';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

type Story = StoryObj<AcmeCombobox>;

const meta: Meta<AcmeCombobox> = {
    title: 'Example/AcmeCombobox',
    component: AcmeCombobox,
    decorators: [
        applicationConfig({
            providers: [importProvidersFrom(BrowserAnimationsModule)]
        })
    ]
};

export default meta;

export const Basic: Story = {
    render: (args) => ({
        props: args,
        template: `
      <acme-combobox
        [options]="options"
        [(value)]="value">
      </acme-combobox>
      <div>Selected: {{ value }}</div>
    `,
    }),
    args: {
        value: 'Option 2',
        options: ['Option 1', 'Option 2', 'Option 3'],
    },
};
