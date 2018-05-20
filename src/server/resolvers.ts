import * as R from '~/graphql/Resolvers';
import scalars from '~/graphql/scalars';
import { Uuid } from '~/common/uuid';
import * as Types from '~/common/types';

import FileDao from '~/db/dao/FileDao';
import UserDao from '~/db/dao/UserDao';
import SettingsDao from '~/db/dao/SettingsDao';
import DivingSpotDao from '~/db/dao/DivingSpotDao';
import DivingSessionDao from '~/db/dao/DivingSessionDao';

import cache from '~/server/cache';

function fakeNull() {
  return Promise.resolve(null);
}

function fakeArray() {
  return Promise.resolve([]);
}

const subTypes: R.SubTypes = {
  User: {
    avatar: fakeNull,
    license: fakeNull,
    medicalCertificate: fakeNull,
    insurance: fakeNull,
    insuranceFile: fakeNull,
    parentalPermissionFile: fakeNull,
    levels(user) {
      return cache.acquiredLevels.values.get(user.id) || [];
    },
    contacts: fakeArray,
    vehicles: fakeArray,
  },
  File: {
    creator(file) {
      return UserDao.byIdRequired(file.id);
    },
  },
  AcquiredLevel: {
    level(acquiredLevel) {
      return cache.levels.get(acquiredLevel.levelId);
    },
    tempFile: fakeNull,
    file: fakeNull,
  },
  Settings: {
    levelN1(settings) {
      return cache.levels.get(settings.levelN1Id);
    },
    levelN2(settings) {
      return cache.levels.get(settings.levelN2Id);
    },
    levelN3(settings) {
      return cache.levels.get(settings.levelN3Id);
    },
    levelN4(settings) {
      return cache.levels.get(settings.levelN4Id);
    },
    levelN5(settings) {
      return cache.levels.get(settings.levelN5Id);
    },
    levelRifap(settings) {
      return cache.levels.get(settings.levelRifapId);
    },
    levelNitroxSimple(settings) {
      return cache.levels.get(settings.levelNitroxSimpleId);
    },
    levelNitroxComplex(settings) {
      return cache.levels.get(settings.levelNitroxComplexId);
    },
    levelInit(settings) {
      return cache.levels.get(settings.levelInitId);
    },
    levelMF1(settings) {
      return cache.levels.get(settings.levelMF1Id);
    },
    levelMF2(settings) {
      return cache.levels.get(settings.levelMF2Id);
    },
    levelBio1(settings) {
      return cache.levels.get(settings.levelBio1Id);
    },
    levelBio2(settings) {
      return cache.levels.get(settings.levelBio2Id);
    },
  },
  DivingSpot: {
    location(spot) {
      return cache.locations.get(spot.locationId);
    },
  },
  DivingSession: {
    spot(session) {
      return DivingSpotDao.byIdRequired(session.spotId);
    },
    director(session) {
      if (session.directorId != null) {
        return UserDao.byIdRequired(session.directorId);
      } else if (session.director != null) {
        return { name: session.director };
      } else {
        return Promise.reject(new Error(``));
      }
    },
  },
  DivingTeam: {
    session(team) {
      return DivingSessionDao.byIdRequired(team.sessionId);
    },
    stops(team) {
      return team.stops.map((stop) => {
        return { depth: stop.x, time: stop.y };
      });
    },
  },
};

const query: R.Query = {
  // name() {
  //   return `asd`;
  // },
  users() {
    return UserDao.all();
  },
  user(obj, args) {
    return UserDao.byId(args.id);
  },
  settings() {
    return cache.settings.values;
  },
  locations() {
    return cache.locations.rows;
  },
  files() {
    return FileDao.all();
  },
};

const mutation: R.Mutation = {
  login(obj, args) {
    return null;
  },
};

const resolvers: R.Resolvers = {
  ...scalars,
  Query: query,
  Mutation: mutation,
  ...subTypes,
};

export default resolvers;
