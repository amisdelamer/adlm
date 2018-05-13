import { compare, hash } from 'bcrypt';
import uuid from '~/common/uuid';
import { User } from '~/common/types';
import { UserTable } from '~/db/types.db';
import UserDao from '~/db/dao/UserDao';
import token from '~/server/token';

// rounds=8 : ~40 hashes/sec
// rounds=9 : ~20 hashes/sec
// rounds=10: ~10 hashes/sec
// rounds=11: ~5  hashes/sec
// rounds=12: 2-3 hashes/sec
// rounds=13: ~1 sec/hash
// rounds=14: ~1.5 sec/hash
// rounds=15: ~3 sec/hash
// rounds=25: ~1 hour/hash
// rounds=31: 2-3 days/hash
const saltRounds = 15;

// function all(): Promise<Array<User>> {
//   return UserDao.all();
// }

function byEmail(email: string): Promise<UserTable> {
  return UserDao.where({ email: email }).then((users) => {
    if (users.length === 1) {
      return users[0];
    } else {
      throw new Error('No user');
    }
  });
}

export function login(email: string, password: string): Promise<UserTable> {
  return byEmail(email).then((user) => {
    return compare(password, user.password).then((match) => {
      if (match) {
        return user;
      } else {
        throw new Error('Wrong password');
      }
    });
  });
}

function forgetPassword(email: string) {
  return byEmail(email).then((user) => {
    // user has 1h to reset its password
    const passwordToken = token.generate(60 * 60 * 1000);

    console.log('FORGET PASSWORD TOKEN:', passwordToken);

    return UserDao.update(user.id, {
      passwordToken,
    });
  });
}
