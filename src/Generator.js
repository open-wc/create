/* eslint-disable no-console, import/no-cycle */
import prompts from 'prompts';
import path from 'path';
import { spawn } from 'child_process';

import {
  copyTemplates,
  copyTemplate,
  copyTemplateJsonInto,
  installNpm,
  writeFilesToDisk,
  optionsToCommand,
} from './core.js';

/**
 * Options for the generator
 * @typedef {object} GeneratorOptions
 * @property {string} [tagName] the dash-case tag name
 * @property {string} [destinationPath='auto'] path to output to. default value 'auto' will output to current working directory
 * @property {'scaffold'} [type='scaffold'] path to output to. default value 'auto' will output to current working directory
 * @property {'true'|'false'} [writeToDisk] whether to write to disk
 * @property {'yarn'|'npm'|'false'} [installDependencies] whether and with which tool to install dependencies
 */

/**
 * dash-case to PascalCase
 * @param  {string} tagName dash-case tag name
 * @return {string}         PascalCase class name
 */
function getClassName(tagName) {
  return tagName
    .split('-')
    .reduce((previous, part) => previous + part.charAt(0).toUpperCase() + part.slice(1), '');
}

class Generator {
  constructor() {
    /**
     * @type {GeneratorOptions}
     */
    this.options = {
      destinationPath: 'auto',
    };
    this.templateData = {};
    this.wantsNpmInstall = true;
    this.wantsWriteToDisk = true;
    this.wantsRecreateInfo = true;
    this.generatorName = '@open-wc';
  }

  execute() {
    if (this.options.tagName) {
      const { tagName } = this.options;
      const className = getClassName(tagName);
      this.templateData = { ...this.templateData, tagName, className };

      if (this.options.destinationPath === 'auto') {
        this.options.destinationPath = process.cwd();
        if (this.options.type === 'scaffold') {
          this.options.destinationPath = path.join(process.cwd(), tagName);
        }
      }
    }
  }

  destinationPath(destination = '') {
    return path.join(this.options.destinationPath, destination);
  }

  copyTemplate(from, to, ejsOptions = {}) {
    copyTemplate(from, to, this.templateData, ejsOptions);
  }

  copyTemplateJsonInto(from, to, options = { mode: 'merge' }, ejsOptions = {}) {
    copyTemplateJsonInto(from, to, this.templateData, options, ejsOptions);
  }

  async copyTemplates(from, to = this.destinationPath(), ejsOptions = {}) {
    return copyTemplates(from, to, this.templateData, ejsOptions);
  }

  async end() {
    if (this.wantsWriteToDisk) {
      this.options.writeToDisk = await writeFilesToDisk();
    }

    if (this.wantsNpmInstall) {
      const answers = await prompts(
        [
          {
            type: 'select',
            name: 'installDependencies',
            message: 'Do you want to install dependencies?',
            choices: [
              { title: 'No', value: 'false' },
              { title: 'Yes, with yarn', value: 'yarn' },
              { title: 'Yes, with npm', value: 'npm' },
            ],
          },
        ],
        {
          onCancel: () => {
            process.exit();
          },
        },
      );
      this.options.installDependencies = answers.installDependencies;
      const { installDependencies } = this.options;
      if (installDependencies === 'yarn' || installDependencies === 'npm') {
        await installNpm(this.options.destinationPath, installDependencies);
        await new Promise(resolve => {
          const install = spawn(installDependencies, ['run', 'analyze'], {
            cwd: this.options.destinationPath,
            shell: true,
          });
          install.stdout.on('data', data => {
            console.log(`${data}`.trim());
          });

          install.stderr.on('data', data => {
            console.log(`analyze: ${data}`);
          });

          install.on('close', () => {
            resolve();
          });
        });
      }
    }

    if (this.wantsRecreateInfo) {
      console.log('');
      console.log('If you want to rerun this exact same generator you can do so by executing:');
      console.log(optionsToCommand(this.options, this.generatorName));
    }
  }
}

export default Generator;
