import chalk from 'chalk';
import yargs, { Argv } from 'yargs';
import { spawn } from 'child_process';

interface Args {
  name?: string;
  'scripts-version'?: string;
  template?: string;
}

const createApp = (args: Args): Promise<void> => {
  return new Promise((resolve, reject): void => {
    if (!args.name) {
      console.error(chalk.red('You must specify a project name'));
      reject();
    }

    if (args.name && args['scripts-version'] && args.template) {
      const proc = spawn('./node_modules/.bin/create-react-app', [
        `--scripts-version=${args['scripts-version']}`,
        `--template=${args.template}`,
        args.name
      ]);

      proc.stdout.on('data', (data): void => {
        process.stdout.write(data);
      });

      proc.stderr.on('data', (data): void => {
        process.stderr.write(data);
      });

      proc.on('close', (): void => {
        resolve();
      });
    }
  });
};

const run = async (): Promise<void> => {
  yargs
    .scriptName('react-in-a-box')
    .usage('$0 [name]')
    .command({
      command: '$0 [name]',
      describe: 'create a new app',
      builder: (yargs): Argv<{ name?: string }> =>
        yargs.positional('name', {
          required: true,
          describe: 'app name',
          type: 'string'
        }),
      handler: async (args: Args): Promise<void> => {
        await createApp(args);
      }
    })
    .demandCommand(1)
    .option('scripts-version', {
      default: '@next',
      describe: 'react-scripts version',
      type: 'string'
    })
    .option('template', {
      default: 'cra-template@next',
      describe: 'template package',
      type: 'string'
    })
    .help().argv;
};

export default run;
