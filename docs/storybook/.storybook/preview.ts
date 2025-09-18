import type { Decorator, Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../../../packages/ds-angular/projects/design-system/documentation.json';
import { variableGroups } from "../../../packages/ds-tokens/variable-groups"
setCompodocJson(docJson);


const globalTypes: Preview['globalTypes'] = {};
variableGroups.forEach((selector) => {
  globalTypes[selector.id] = {
    description: `Choose your ${selector.label}`,
    defaultValue: selector.items[0].value,
    toolbar: {
      title: selector.label,
      icon: null,
      showName: true,
      items: selector.items,
    },
  };
});


const preview: Preview = {
  parameters: {
    docs: {
      codePanel: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },

  globalTypes,
};


export const decorators: Decorator[] = [
  (storyFn, context) => {
    const globals = context.globals as any;
    variableGroups.forEach((selector) => {
      const cssClass = selector.cssPrefix + globals[selector.id];
      document.body.classList.remove(...selector.items.map((i) => selector.cssPrefix + i.value));
      document.body.classList.add(cssClass);
    });
    return storyFn();
  },
];



export default preview;
