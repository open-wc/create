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
  title?: string;
  backgroundColor?: string;
}

const Template: Story<ArgTypes> = ({ title, backgroundColor = 'white' }: ArgTypes) => html`
  <<%= tagName %> style="--<%= tagName %>-background-color: ${backgroundColor}" .title=${title}></<%= tagName %>>
`;

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
