import { expect, test } from 'bun:test';
import { verifyShots } from './verify-shots';

test('verifyShots passes after generate', () => {
  const { ok, problems } = verifyShots();
  if (!ok) console.error(problems.join('\n'));
  expect(ok).toBe(true);
});
