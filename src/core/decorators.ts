/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-types */

import { IsArray, IsEnum, registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { Connection, In, Not, ObjectType } from 'typeorm';
import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';

export class Holder {
  private static connection: Connection;

  public static setConnection(c: Connection): void {
    Holder.connection = c;
  }

  static getConnection(): Connection {
    return Holder.connection;
  }
}

type RunnerFn = (object: unknown, propertyName: string) => void;

type RunnerType = (
  name: string,
  fn: (conn: Connection, val: unknown, opt: ValidationArguments) => boolean | Promise<boolean>,
  defaultMessageFunction: (args: ValidationArguments) => string,
  validationOptions?: ValidationOptions,
) => RunnerFn;

export const runner: RunnerType = (name, fn, defaultMessageFunction, validationOptions?) =>
  function (object, propertyName): void {
    registerDecorator({
      name: name,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      target: (object as any).constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate: (value: unknown, opt: ValidationArguments): boolean | Promise<boolean> =>
          fn(Holder.getConnection(), value, opt),
        defaultMessage: (args: ValidationArguments): string => {
          return defaultMessageFunction(args);
        },
      },
    });
  };

export function ArrayStringToEnum(numberEnum: any) {
  return applyDecorators(
    Transform(({ value }) => {
      let input = value;
      if (!Array.isArray(value)) {
        input = [value];
      }
      const enums: typeof numberEnum[] = [];
      input.forEach((el: string) => {
        const keys = Object.keys(numberEnum).filter((i) => Number.isNaN(+i));
        enums.push(keys.indexOf(el));
      });
      return enums;
    }),
    IsArray(),
    IsEnum(numberEnum, {
      each: true,
      message: (args: ValidationArguments) =>
        `${args.property} must be one of: ${Object.values(numberEnum).join(', ')}.`,
    }),
  );
}

export function IsEnumWithMessage(entity: object) {
  return applyDecorators(
    IsEnum(entity, {
      message: (args: ValidationArguments) =>
        `${args.property} must be one of: ${Object.values(entity)
          .filter((i) => Number.isNaN(+i))
          .join(', ')}.`,
    }),
  );
}

type ExistsType = (
  entity: ObjectType<unknown>,
  column: string,
  _with?: string,
  where?: { [k: string]: unknown },
  message?: string,
) => RunnerFn;

export const Exists: ExistsType = (entity, column, _with?, where?, message?) =>
  runner(
    'Exists',
    async (conn, value, validationObject) => {
      if (Array.isArray(value) && value.length == 0) return true;

      if (!Array.isArray(value) && (Number.isNaN(value) || value == 0)) return false;

      column = column || validationObject.property;
      if (_with) {
        const withValue: string = (validationObject.object as Record<string, unknown>)[_with] as string;
        where = {
          ...where,
          [_with]: Array.isArray(withValue) ? In(withValue) : withValue,
        };
      }
      if (Array.isArray(value) && typeof value[0] === 'object') {
        value = value.map((i) => i[column]);
      }
      const records = await conn.getRepository(entity).find({
        select: [column],
        where: {
          ...where,
          [column]: Array.isArray(value) ? In(value) : value,
        },
        take: Array.isArray(value) ? value.length : 1,
      });

      return Array.isArray(value) ? records.length == value.length : records.length > 0;
    },
    (args) => {
      if (Number.isNaN(args.value)) return `${column} value ${args.value} must be a valid number!`;
      if (message) return message;
      return `${column} value ${args.value} does not exists`;
    },
  );

type UniqueType = (entity: ObjectType<unknown>, column: string, ignoreSelf?: boolean) => RunnerFn;
export const Unique: UniqueType = (entity, column, ignoreSelf = false) =>
  runner(
    'Unique',
    async (conn, value, validationObject) => {
      if (Number.isNaN(value)) return false;

      column = column || validationObject.property;
      const records = await conn.getRepository(entity).find({
        select: [column],
        where: {
          [column]: typeof value === 'string' ? value.trim().toLowerCase() : value,
          ...(ignoreSelf
            ? {
                id: Not((validationObject.object as Record<string, unknown>)['id']),
              }
            : {}),
        },
        take: 1,
      });
      return records.length === 0;
    },
    (args) => {
      if (Number.isNaN(args.value)) return `${column} value ${args.value} must be a valid number!`;

      return `${args.property} value (${JSON.stringify(args.value)}) must be unique`;
    },
  );

type RawUniqueType = (
  entity: ObjectType<unknown>,
  column: string,
  ignoreSelf?: boolean,
  valueAccessor?: (v: unknown) => unknown,
) => RunnerFn;
export const RawUnique: RawUniqueType = (entity, column, ignoreSelf?, valueAccessor?) =>
  runner(
    'RawUnique',
    async (conn, value, { object }) => {
      const record = conn.getRepository(entity).createQueryBuilder().where('deleted_at IS NULL');

      if (valueAccessor) {
        value = valueAccessor(value);
      }
      record.andWhere(`${column} = :column`, { column: value });

      if (ignoreSelf && (object as Record<string, number>).id) {
        record.andWhere('id != :id', { id: (object as Record<string, number>).id });
      }

      const instance = await record.getOne();
      return instance == undefined;
    },
    (args) => {
      return `${args.property} value (${JSON.stringify(args.value)}) must be unique`;
    },
  );

type RawExistsType = (entity: ObjectType<unknown>, column: string) => RunnerFn;
export const RawExists: RawExistsType = (entity, column) =>
  runner(
    'RawExists',
    async (conn, value, _) => {
      const records = await conn
        .getRepository(entity)
        .createQueryBuilder()
        .where(`${column} = :value AND deleted_at IS NULL`, { value: value })
        .getOne();

      return records != undefined;
    },
    (args) => {
      return `${column} value (${JSON.stringify(args.value)}) does not exists `;
    },
  );

type OnlyType = (check: string, field: string, list: string[]) => RunnerFn;
export const Only: OnlyType = (check, field, list) =>
  runner(
    'Only',
    (_, __, { object }) => {
      if (list.includes((object as Record<string, string>)[field])) {
        return true;
      } else {
        if (!(object as Record<string, unknown>)[check]) return true;
      }

      return false;
    },
    () => {
      return `${check} can have value only ${field} be on of ${list} list`;
    },
  );

type CustomRequiredWhenType = (check: string, field: string, list: string[]) => RunnerFn;
export const CustomRequiredWhen: CustomRequiredWhenType = (check, field, list) =>
  runner(
    'CustomRequiredWhen',
    (_, value, { object }) => {
      if (!list.includes((object as Record<string, string>)[field])) {
        return true;
      }
      const _value = (object as Record<string, unknown>)[check];
      if (_value == null) {
        return false;
      }
      if (!(value as string | number).toString().trim()) {
        return false;
      }
      return true;
    },
    () => {
      return `${check} is required`;
    },
  );

export const IsOnlyDate = (): RunnerFn =>
  runner(
    'IsOnlyDate',
    (__, value, _) => {
      if (isNaN(value as number)) {
        // invalid date is NaN
        return false;
      }
      return (value as Date).getHours() + (value as Date).getMinutes() + (value as Date).getSeconds() === 0;
    },
    () => {
      return `provide only date like YYYY-MM-DD`;
    },
  );
