/* eslint-disable no-console */
import { pipe } from 'fp-ts/function';
import { none, Option, some } from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import * as T from 'fp-ts/Task';
import * as E from 'fp-ts/Either';
import * as IO from 'fp-ts/IO';
import { match, select } from 'ts-pattern';

type NonRunnableConfig = ErrInvalidConfig | ErrNoFile | UserNeedsHelp;

function parseConfigFromArgs(
  rawArgs: readonly string[]
): TE.TaskEither<NonRunnableConfig, RunConfig> {
  return pipe(
    TE.Do,
    TE.bind('cliConfig', () => TE.fromEither(parseCLIArgs(rawArgs))),
    TE.bindW('fileConfig', ({ cliConfig }) => {
      const optionPath = match(cliConfig)
        .with({ configPath: select() }, some)
        .otherwise(() => none);

      return parseFileConfig(optionPath);
    }),
    TE.chainEitherKW(mergeArgsAndConfig)
  );
}

// eslint-disable-next-line import/prefer-default-export
export function main(args: readonly string[]): void {
  pipe(
    args,
    parseConfigFromArgs,
    TE.fold((left) => {
      return TE.of(
        match(left)
          .with({ _tag: 'UserNeedsHelp' }, () => {
            return 'user help';
          })
          .otherwise(() => {
            return 'poop';
          })
      );
    }, moveImages),
    T.map(printResult)
  )();
}

type FileConfig = {
  readonly _tag: 'FileConfig';
  readonly foo: string;
};

type ErrNoFile = {
  readonly _tag: 'ErrNoFile';
  readonly path: string;
  readonly isDirNotFile: boolean;
};

type FilePath = {
  readonly _tag: 'FilePath';
  readonly path: string;
};

type CliHelp = {
  readonly _tag: 'CliHelp';
  readonly help: true;
};
type CliConfigOverride = {
  readonly _tag: 'CliConfigOverride';
  readonly configPath: FilePath;
  readonly cheese: true;
};
type CliConfig = CliConfigOverride | CliHelp;

type Configs = {
  readonly cliConfig: CliConfig;
  readonly fileConfig: FileConfig;
};

type RunConfig = {
  readonly _tag: 'RunConfig';
  readonly foo: string;
};

type ErrInvalidConfig = {
  readonly _tag: 'ErrInvalidConfig';
  readonly message: string;
};

// type WIPError = {
//   readonly _tag: 'WIPError';
//   readonly wip: true;
// };

declare function parseFileConfig(
  configLocation: Option<FilePath>
): TE.TaskEither<ErrNoFile, FileConfig>;

type UserNeedsHelp = {
  readonly _tag: 'UserNeedsHelp';
};

declare function parseCLIArgs(cliArgs: readonly string[]): E.Either<UserNeedsHelp, CliConfig>;

declare function mergeArgsAndConfig(configs: Configs): E.Either<ErrInvalidConfig, RunConfig>;

declare function moveImages(config: RunConfig): TE.TaskEither<string, string>;

declare function printResult(eitherResult: E.Either<string, string>): IO.IO<void>;
