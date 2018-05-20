import express, { Request } from 'express';
import iron from 'iron';
import UserDao from '~/db/dao/UserDao';
import { UserTable } from 'db/types.db';
import { Context } from '~/graphql/Resolvers';

async function getUser(req: Request): Promise<UserTable | null> {
  const cookie = req.cookies.adlm;
  if (cookie == null || cookie === '') {
    return null;
  }
  const userCookie = await iron.unseal(
    cookie,
    process.env.SECRET || '',
    iron.defaults
  );
  const user = await UserDao.byId(userCookie['userId'] || '');
  if (user == null || user.sessionToken !== userCookie['sessionToken']) {
    return null;
  }
  return user;
}

export async function getContext(req: Request): Promise<Context> {
  const user = await getUser(req);
  return {
    request: req,
    user: user,
  };
}
