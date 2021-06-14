import { html } from 'lit';
import '../src/<%= tagName %>.js';

export default {
  title: '<%= className %>',
  component: '<%= tagName %>',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <<%= tagName %>
      style="--<%= tagName %>-background-color: ${backgroundColor || 'white'}"
      .title=${title}
    >
    </<%= tagName %>>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
