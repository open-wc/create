/* eslint-disable no-console */
import prompts from 'prompts';
import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { executeMixinGenerator } from '../../core.js';
import { AppLitElementMixin } from '../app-lit-element/index.js';
import { TsAppLitElementMixin } from '../app-lit-element-ts/index.js';

import header from './header.js';
import { gatherMixins } from './gatherMixins.js';

/**
 * Allows to control the data via command line
 *
 * example:
 * npm init @open-wc --type scaffold --scaffoldType app --tagName foo-bar --installDependencies false
 * npm init @open-wc --type upgrade --features linting demoing --tagName foo-bar --installDependencies false
 */
const optionDefinitions = [
  {
    name: 'destinationPath',
    description: 'The path the generator will write files to',
    type: String,
    typeLabel: '{underline path}',
  },
  {
    name: 'type',
    description:
      'Choose {bold scaffold} to create a new project or {bold upgrade} to add features to an existing project',
    typeLabel: '{underline scaffold|upgrade}',
    type: String,
  },
  {
    name: 'scaffoldType',
    description:
      'The type of project to scaffold. {bold wc} for a single published component, {bold app} for an application',
    type: String,
    typeLabel: '{underline wc|app}',
  },
  {
    name: 'features',
    description:
      'Which features to include. {bold linting}, {bold testing}, {bold demoing}, or {bold building}',
    type: String,
    typeLabel: '{underline linting|testing|demoing|building}',
    multiple: true,
  },
  {
    name: 'typescript',
    description: 'Whether to use TypeScript in your project',
    type: String,
    typeLabel: '{underline true|false}',
  },
  {
    name: 'tagName',
    description: 'The tag name for the web component or app shell element',
    type: String,
    typeLabel: '{underline string}',
  },
  {
    name: 'installDependencies',
    description:
      'Whether to install dependencies. Choose {bold npm} or {bold yarn} to install with those package managers, or {bold false} to skip installation',
    type: String,
    typeLabel: '{underline yarn|npm|false}',
  },
  {
    name: 'writeToDisk',
    description: 'Whether or not to actually write the files to disk',
    type: String,
    typeLabel: '{underline true|false}',
  },
  {
    name: 'help',
    description: 'This help message',
    type: Boolean,
  },
];

const overrides = commandLineArgs(optionDefinitions);

if (overrides.help) {
  const sections = [
    {
      content: header,
      raw: true,
    },
    {
      header: 'Usage',
      content: '$ npm init @open-wc [<options>]',
    },
    {
      header: 'Options',
      optionList: optionDefinitions,
    },
  ];

  const usage = commandLineUsage(sections);
  console.log(usage);
  process.exit(0);
}

prompts.override(overrides);

export const AppMixin = subclass =>
  // eslint-disable-next-line no-shadow
  class AppMixin extends subclass {
    constructor() {
      super();
      this.wantsNpmInstall = false;
      this.wantsWriteToDisk = false;
      this.wantsRecreateInfo = false;
    }

    async execute() {
      console.log(header);
      console.log('Note: you can exit any time with Ctrl+C or Esc');
      const questions = [
        {
          type: 'select',
          name: 'type',
          message: 'What would you like to do today?',
          choices: [
            { title: 'Scaffold a new project', value: 'scaffold' },
            { title: 'Upgrade an existing project', value: 'upgrade' },
          ],
        },
        {
          type: (prev, all) => (all.type === 'scaffold' ? 'select' : null),
          name: 'scaffoldType',
          message: 'What would you like to scaffold?',
          choices: [
            { title: 'Web Component', value: 'wc' },
            { title: 'Application', value: 'app' },
          ],
        },
        {
          type: (prev, all) =>
            all.scaffoldType === 'wc' || all.scaffoldType === 'app' || all.type === 'upgrade'
              ? 'multiselect'
              : null,
          name: 'features',
          message: 'What would you like to add?',
          choices: (prev, all) =>
            [
              { title: 'Linting (eslint & prettier)', value: 'linting' },
              { title: 'Testing (web-test-runner)', value: 'testing' },
              { title: 'Demoing (storybook)', value: 'demoing' },
              all.scaffoldType !== 'wc' && {
                title: 'Building (rollup)',
                value: 'building',
              },
            ].filter(_ => !!_),
        },
        {
          type: 'select',
          name: 'typescript',
          message: 'Would you like to use typescript?',
          choices: [
            { title: 'No', value: 'false' },
            { title: 'Yes', value: 'true' },
          ],
        },
        {
          type: (prev, all) => (all.tagName ? null : 'text'),
          name: 'tagName',
          message: (prev, all) =>
            `What is the tag name of your ${
              all.scaffoldType === 'app' ? 'app shell element' : 'web component'
            }?`,
          validate: tagName =>
            !/^([a-z])(?!.*[<>])(?=.*-).+$/.test(tagName)
              ? 'You need a minimum of two lowercase words separated by dashes (e.g. foo-bar)'
              : true,
        },
      ];

      /**
       * {
       *   type: 'scaffold',
       *   scaffoldType: 'wc',
       *   features: [ 'testing', 'building' ],
       *   tagName: 'foo-bar',
       *   installDependencies: 'false'
       * }
       */
      this.options = await prompts(questions, {
        onCancel: () => {
          process.exit();
        },
      });

      if (this.options.type === 'scaffold') {
        // when using the new project scaffold, infer _scaffoldFilesFor from selected features
        this.options._scaffoldFilesFor = [...this.options.features];
      }

      const mixins = gatherMixins(this.options);
      // app is separate to prevent circular imports
      if (this.options.type === 'scaffold' && this.options.scaffoldType === 'app') {
        if (this.options.typescript === 'true') {
          mixins.push(TsAppLitElementMixin);
        } else {
          mixins.push(AppLitElementMixin);
        }
      }
      await executeMixinGenerator(mixins, this.options);
    }
  };

export default AppMixin;
