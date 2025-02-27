import {
    Controller,
    Get,
    Post,
    Body,
    UsePipes,
    ValidationPipe,
    UseGuards,
    Patch,
    NotFoundException,
    Delete,
    Param,
    ParseIntPipe,
  } from '@nestjs/common';
  import { UserService } from './user.service';
  import { CreateUserDto } from './dto/create-user.dto';
  import { AuthGuard } from '@nestjs/passport';
  import {
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
  } from '@nestjs/swagger';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { User } from './entities/user.entity';
  import { DeleteResult } from 'typeorm';
  
  @Controller('user')
  @ApiTags('User API')
  export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}
  
    //User 생성
    @ApiOperation({ summary: 'User 생성 API', description: 'User 생성' })
    @ApiBody({ description: 'User 생성 시 요청 Body', type: CreateUserDto })
    //@ApiBearerAuth('access-token')
    @Post('/create')
    @UsePipes(ValidationPipe)
    async create(
      @Body() createUserDto: CreateUserDto,
    ): Promise<void> {
      return await this.userService.createUser(createUserDto);
    }
  
    //User 업데이트
    @ApiOperation({ summary: 'User 업데이트 API', description: 'User 업데이트' })
    @ApiBody({ description: 'User 업데이트 시 요청 Body', type: UpdateUserDto })
    //@ApiBearerAuth('access-token')
    @Patch('/update')
    //@UseGuards(AuthGuard('jwt'))
    @ApiCreatedResponse({ description: '수정된 User 반환', type: UpdateUserDto })
    @UsePipes(ValidationPipe)
    async update(
      @Body() updateUserDto: UpdateUserDto,
    
    ): Promise<void> {
      if (updateUserDto.username !== undefined && updateUserDto.password !== undefined){
        const findUser = await this.userService.findUserByIdAndPassword(
          updateUserDto.username,
          updateUserDto.password,
        );
        if (!findUser?.id && !findUser?.password) {
          throw new NotFoundException(null, 'Wrong userId or Password');
        }
    
        return this.userService.updateUser(
          updateUserDto,
          findUser.id,
        );
      } 
    }
  
    //User 조회
    @Get('/')
    @ApiOperation({
      summary: 'User List 조회 API',
      description: 'User List 조회',
    })
    async getListAll(): Promise<User[]> {
      return await this.userService.getListAll();
    }
  
    //User 삭제
    @ApiOperation({ summary: 'User 삭제 API', description: 'User 삭제' })
    @ApiBearerAuth('access-token')
    @Delete('/:id')
    async delete(
      @Param('id', ParseIntPipe) id: number,
    ): Promise<DeleteResult> {
      //User 삭제 실행
      return await this.userService.deleteUser(id);
    }
  }