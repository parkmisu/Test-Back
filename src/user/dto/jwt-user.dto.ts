import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Request } from 'express';
import { User } from '../entities/user.entity';

export class JwtUserDto extends PickType(CreateUserDto, [
  'username',
  'password',
] as const) {}

export interface UserReq extends Request {
  user: User;
}