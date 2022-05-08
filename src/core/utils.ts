import { classToPlain } from 'class-transformer';
import { SortEnum } from './enums/sort.enum';

export function mapList<T, U extends keyof T>(instances: T[], key: U): Map<T[U], T> {
  return instances.reduce((t, c) => t.set(c[key], c), new Map<T[U], T>());
}

export function reduceBy<T, U extends keyof T, V extends keyof T>(instances: T[], key: U, value: V): Map<T[U], T[V]> {
  return instances.reduce((t, c) => t.set(c[key], c[value]), new Map<T[U], T[V]>());
}

export function groupBy<T, U extends keyof T>(instances: T[], key: U): Map<T[U], T[]> {
  const out = new Map<T[U], T[]>();
  for (const instance of instances) {
    if (!out.has(instance[key])) {
      out.set(instance[key], []);
    }
    out.get(instance[key])!.push(instance);
  }
  return out;
}

export type RequireBy<T, K extends keyof T> = { [X in Exclude<keyof T, K>]: T[X] } & { [P in K]-?: Required<T[P]> };

type Undefined2Null<T> = T extends undefined ? null : T;

export type Undefined2NullNested<T> = T extends Date
  ? T
  : T extends Array<infer E>
  ? Array<Undefined2NullNested<E>> // eslint-disable-next-line @typescript-eslint/ban-types
  : T extends object
  ? {
      [K in keyof T]: Undefined2NullNested<T[K]>;
    }
  : Undefined2Null<T>;

type Null2Undefined<T> = T extends null ? undefined : T;

export type Null2UndefinedNested<T> = T extends Date
  ? T
  : T extends Array<infer E>
  ? Array<Null2UndefinedNested<E>> // eslint-disable-next-line @typescript-eslint/ban-types
  : T extends object
  ? {
      [K in keyof T]: Null2UndefinedNested<T[K]>;
    }
  : Null2Undefined<T>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NoErr<T extends { error?: any; data?: any }> = Omit<RequireBy<T, 'data'>, 'error'>;

export type UnNull<T> = { [P in keyof T]: NonNullable<T[P]> };
export type Always<T> = UnNull<Required<T>>;

export function null2undefine<T>(obj: T): Null2UndefinedNested<T> {
  type R = Null2UndefinedNested<T>;
  if (obj === null) {
    return undefined as unknown as R;
  }
  if (typeof obj !== 'object') {
    return obj as unknown as R;
  }
  if (obj instanceof Array) {
    return obj.map(null2undefine) as unknown as R;
  }
  return Object.keys(obj).reduce(
    (result, key) => ({
      ...result,
      [key]: null2undefine(obj[key as keyof T]),
    }),
    {},
  ) as unknown as R;
}

export function DateOnly(i?: Date): Date {
  i = i ?? new Date();
  i.setHours(0, 0, 0, 0);
  return i;
}

type ObjOrArray<T> = T extends Array<infer U> ? U[] : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serialize<X extends ObjOrArray<any>>(obj: X): X {
  return classToPlain(obj) as X;
}

export function sortBy<X, U extends keyof X>(objs: X[], column: U, dir: SortEnum): X[] {
  switch (dir) {
    case SortEnum.ASC:
      objs.sort((a, b) => (a[column] > b[column] ? 1 : b[column] > a[column] ? -1 : 0));
      break;
    case SortEnum.DESC:
      objs.sort((a, b) => (a[column] < b[column] ? 1 : b[column] < a[column] ? -1 : 0));
      break;
  }
  return objs;
}

export function randomGenerator(length = 1, maxChars = 9999): string {
  let randomString = '';
  for (let i = 0; i < length; i++) {
    randomString += Math.random().toString(36).substring(2, 15);
  }

  return randomString.substring(0, maxChars);
}

export function delayedLoop(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  objs: any[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  cb: Function,
  timeout = 100,
): void {
  const loop = (index: number): void => {
    setTimeout(async () => {
      const obj = objs[index];
      await cb(obj);
      if (index < objs.length - 1) {
        console.log(index + 1, objs.length - 1);
        loop(index + 1);
      } else {
        console.log('DONE');
      }
    }, timeout);
  };
  loop(0);
}
