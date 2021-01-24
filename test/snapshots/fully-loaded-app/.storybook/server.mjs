import { storybookPlugin } from '@web/dev-server-storybook';
import baseConfig from '../web-dev-server.config.mjs';

export default /** @type {import('@web/dev-server').DevServerConfig} */ ({
  ...baseConfig,
  open: '/',
  plugins: [...baseConfig.plugins, storybookPlugin({ type: 'web-components' })],
});