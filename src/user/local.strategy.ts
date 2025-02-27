import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userService: UserService,
  ) {
    super({
      usernameField: 'id',
      passwordField: 'password',
    });
  }

  async validate(id: number, password: string): Promise<any> {
    const user = await this.userService.validateUser(id, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}