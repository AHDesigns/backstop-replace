import { main } from '.';

describe('tests', () => {
  it('should run', async () => {
    await main();
    expect(true).toBe(true);
  });
});
