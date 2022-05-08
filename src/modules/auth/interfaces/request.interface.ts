import express from 'express';
import { UserEntity } from '../../user/entities/user.entity';

export interface IReq extends express.Request {
  user: UserEntity;
}
