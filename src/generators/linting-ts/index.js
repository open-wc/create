/* eslint-disable no-console */
import { TsLintingEsLintMixin } from '../linting-eslint-ts/index.js';
import { TsLintingPrettierMixin } from '../linting-prettier-ts/index.js';

export const TsLintingMixin = subclass =>
  class extends TsLintingPrettierMixin(TsLintingEsLintMixin(subclass)) {
    async execute() {
      await super.execute();

      // extend package.json
      this.copyTemplateJsonInto(
        `${__dirname}/templates/package.json`,
        this.destinationPath('package.json'),
      );

      await this.copyTemplates(`${__dirname}/templates/static/**/*`);
    }
  };
