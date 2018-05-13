import { Duration } from 'luxon';
import uuid from '~/common/uuid';

type Token = string;

// duration in ms
function generate(duration?: number): Token {
  if (duration) {
    return uuid() + '_' + (Date.now() + duration);
  }
  return uuid();
}

function isExpired(token: Token): boolean {
  const parts = token.split('_');
  const timestamp = parseInt(parts[1], 10);
  return !isNaN(timestamp) && timestamp != null && timestamp < Date.now();
}

export default {
  generate,
  isExpired,
};
