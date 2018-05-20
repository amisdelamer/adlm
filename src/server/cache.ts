import uuid, { Uuid } from '~/common/uuid';
import {
  AcquiredLevelTable,
  LevelTable,
  SettingsTable,
  LocationTable,
} from '~/db/types.db';
import AcquiredLevelDao from '~/db/dao/AcquiredLevelDao';
import LevelDao from '~/db/dao/LevelDao';
import LocationDao from '~/db/dao/LocationDao';
import SettingsDao from '~/db/dao/SettingsDao';

abstract class Cache<T> {
  refreshedAt: number = 0;
  abstract values: T;
  abstract getValues(): Promise<T>;
  refresh() {
    return this.getValues()
      .then((values) => {
        const now = Date.now();
        if (now > this.refreshedAt) {
          this.refreshedAt = now;
          this.values = values;
        }
      })
      .catch((e) => {
        console.log('Failed to refresh');
        console.error(e);
        throw e;
      });
  }
}

abstract class TableCache<T> extends Cache<Map<Uuid, T>> {
  rows: Array<T> = [];
  get(id: Uuid): Promise<T> {
    const value = this.values.get(id);
    return value == null
      ? Promise.reject(new Error(`Missing value ${id}`))
      : Promise.resolve(value);
  }
  refresh() {
    return super.refresh().then(() => {
      this.rows = Array.from(this.values.values());
    });
  }
}

class LocationCache extends TableCache<LocationTable> {
  values = new Map<Uuid, LocationTable>();
  getValues() {
    return LocationDao.all().then((locations) => {
      return locations.reduce((values, location) => {
        values.set(location.id, location);
        return values;
      }, new Map<Uuid, LocationTable>());
    });
  }
}

class LevelCache extends TableCache<LevelTable> {
  values = new Map<Uuid, LevelTable>();
  getValues() {
    return LevelDao.all().then((levels) => {
      return levels.reduce((values, level) => {
        values.set(level.id, level);
        return values;
      }, new Map<Uuid, LevelTable>());
    });
  }
}

class AcquiredLevelCache extends Cache<Map<Uuid, Array<AcquiredLevelTable>>> {
  values = new Map<Uuid, Array<AcquiredLevelTable>>();
  getValues() {
    return AcquiredLevelDao.all().then((levels) => {
      return levels.reduce((values, level) => {
        values.set(
          level.userId,
          (values.get(level.userId) || []).concat([level])
        );
        return values;
      }, new Map<Uuid, Array<AcquiredLevelTable>>());
    });
  }
}

const fakeUuid = uuid();
class SettingsCache extends Cache<SettingsTable> {
  values = {
    id: fakeUuid,
    googleMapsApiKey: '',
    levelN1Id: fakeUuid,
    levelN2Id: fakeUuid,
    levelN3Id: fakeUuid,
    levelN4Id: fakeUuid,
    levelN5Id: fakeUuid,
    levelRifapId: fakeUuid,
    levelNitroxSimpleId: fakeUuid,
    levelNitroxComplexId: fakeUuid,
    levelInitId: fakeUuid,
    levelMF1Id: fakeUuid,
    levelMF2Id: fakeUuid,
    levelBio1Id: fakeUuid,
    levelBio2Id: fakeUuid,
  };
  getValues() {
    return SettingsDao.all().then((settings) => {
      if (settings.length === 1) {
        return settings[0];
      } else {
        throw new Error('Settings table should have exactly one row');
      }
    });
  }
}

const caches = {
  acquiredLevels: new AcquiredLevelCache(),
  levels: new LevelCache(),
  locations: new LocationCache(),
  settings: new SettingsCache(),
};

export function init(): Promise<void> {
  return Promise.all(Object.keys(caches).map((c) => caches[c].refresh())).then(
    (v) => undefined
  );
}

export default caches;
