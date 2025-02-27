import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteResult } from 'typeorm';

export class UserService {
  constructor(
    @InjectRepository(User, 'default')
    private userRepository: Repository<User>,
    private dataSource: DataSource,
  ) {}

  //User 생성
  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<void> {
    //id(PK) 계산
    const max_pk = JSON.stringify(
      await this.dataSource.query(`select max(id) from user_data`),
    );
  
    let userPk: number;
    if (
      parseInt(max_pk.split(':')[1]) === 0 ||
      isNaN(parseInt(max_pk.split(':')[1])) === true
    ) {
      userPk = 1;
    } else {
      userPk = parseInt(max_pk.split(':')[1]) + 1;
    }

    //비밀번호 암호화
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const newUser = this.userRepository.create({
      id: userPk,
      username: createUserDto.username,
      password: hashedPassword,
    });
    try {
      await this.userRepository.save(newUser);
    } catch (err) {
      throw new Error('User creation failed. Please try again.');
    }
  }

  //User 업데이트
  async updateUser(
    updateUserDto: UpdateUserDto,
    id: number,
  ): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if(user !== null){
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(updateUserDto.updatePassword, salt);
  
      if (updateUserDto.username !== undefined) {
        user.username = updateUserDto.username;
      }
      await this.userRepository.save(user);
    }
  }
  
//아이디 비밀번호 검색(User 업데이트 시 사용)
  async findUserByIdAndPassword(
    username: string,
    password: string,
  ) {
    const user = await this.userRepository.findOne({
      where: { username: username },
      select: ['username', 'password'],
    });
    if (!user || (user && !(await bcrypt.compare(password, user.password)))) {
      throw new UnauthorizedException(null, 'password is not compare!!');
    }

    const data = await this.userRepository.findOne({
      where: { id: user.id },
    });

    if(data !== null){
      return data;
    }
  }

  //User List 조회
  async getListAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { id: 'ASC' },
    });
  }
  async validateUser(id: number, password: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { id: id },
      select: ['id', 'password'],
    });
    if (!user || (user && !(await bcrypt.compare(password, user.password)))) {
      return null;
    }
    return this.userRepository
      .createQueryBuilder('user')
      .select('id')
      .where('user."id" = :value', { value: id });
  }

  //User 삭제
  async deleteUser(userNo: number): Promise<DeleteResult> {
    const deleteUser = await this.userRepository.delete(userNo);

    if (deleteUser.affected == 0) {
      throw new NotFoundException("Can't Find Data");
    } else return deleteUser;
  }
}