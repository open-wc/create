import { html, TemplateResult } from 'lit';
import '../src/<%= tagName %>.js';

export default {
  title: '<%= className %>',
  component: '<%= tagName %>',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  header?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({ header, backgroundColor = 'white' }: ArgTypes) => html`
  <<%= tagName %> style="--<%= tagName %>-background-color: ${backgroundColor}" .header=${header}></<%= tagName %>>
`;

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
