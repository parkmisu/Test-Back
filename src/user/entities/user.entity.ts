import { BaseEntity, Column, Entity, PrimaryColumn, Unique } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiProperty } from '@nestjs/swagger';

@Entity('user_data')
@Unique(['id'])
export class User extends BaseEntity {
  @ApiProperty({ example: 1 })
  @PrimaryColumn({ select: false })
  id: number;

  @ApiProperty({ example: 'user2' })
  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  static createFrom(createUserDto: CreateUserDto,  user_pk: number) {
    const user = new User();
    user.id = user_pk;
    user.username = createUserDto.username;
    user.password = createUserDto.password;
    return user;
  }
}