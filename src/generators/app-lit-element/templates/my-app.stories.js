import { html } from 'lit';
import '../src/<%= tagName %>.js';

export default {
  title: '<%= className %>',
  component: '<%= tagName %>',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ header, backgroundColor }) {
  return html`
    <<%= tagName %>
      style="--<%= tagName %>-background-color: ${backgroundColor || 'white'}"
      .header=${header}
    >
    </<%= tagName %>>
  `;
}

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
