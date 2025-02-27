import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, Matches } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    example: 'password',
    description: '비밀번호 (대소문자 & 숫자)',
  })
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'password only accepts english and number',
  })
  updatePassword: string;
}