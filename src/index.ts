/* eslint-disable no-console */

// eslint-disable-next-line import/prefer-default-export
export async function main(args: readonly string[]): Promise<void> {
  console.log('args:\n');
  args.forEach((x) => {
    console.log(x);
  });
  const msg = await Promise.resolve('\ndone');
  console.log(msg);
}
