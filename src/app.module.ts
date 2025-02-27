import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3307,
      username: 'root',
      password: 'mysql',
      database: 'mysql',
      entities: [__dirname + '/entity/**/*.entity{.ts,.js}',],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
