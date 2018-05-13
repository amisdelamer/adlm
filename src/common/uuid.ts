import { v4 } from 'uuid';

export type Uuid = string & { _: 'UUID' };

export default function uuid(): Uuid {
  return v4() as Uuid;
}
