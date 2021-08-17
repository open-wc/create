import { html } from 'lit';
import '../src/scaffold-app.js';

export default {
  title: 'ScaffoldApp',
  component: 'scaffold-app',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ title, backgroundColor }) {
  return html`
    <scaffold-app
      style="--scaffold-app-background-color: ${backgroundColor || 'white'}"
      .title=${title}
    >
    </scaffold-app>
  `;
}

export const App = Template.bind({});
App.args = {
  title: 'My app',
};
