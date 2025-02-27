import {
    IsNotEmpty,
    Matches,
  } from 'class-validator';
  import { ApiProperty } from '@nestjs/swagger';
  
  export class CreateUserDto {
    // @ApiProperty({ example: 1, description: 'User ID' })
    // @IsNotEmpty()
    // id: number;
  
    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
      example: 'password',
      description: '비밀번호 (대소문자 & 숫자)',
    })
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9]*$/, {
      message: 'password only accepts english and number',
    })
    password: string;

  }