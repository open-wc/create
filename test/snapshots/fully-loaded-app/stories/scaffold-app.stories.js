import { html } from 'lit';
import '../src/scaffold-app.js';

export default {
  title: 'ScaffoldApp',
  component: 'scaffold-app',
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

function Template({ header, backgroundColor }) {
  return html`
    <scaffold-app
      style="--scaffold-app-background-color: ${backgroundColor || 'white'}"
      .header=${header}
    >
    </scaffold-app>
  `;
}

export const App = Template.bind({});
App.args = {
  header: 'My app',
};
