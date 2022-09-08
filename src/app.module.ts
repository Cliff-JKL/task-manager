require('dotenv').config();
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { logger } from './common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Task } from './tasks/entities/task.entity';
const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE_NAME } =
  process.env;

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_HOST,
      port: Number(DB_PORT),
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE_NAME,
      entities: [User, Task],
      synchronize: true,
      migrations: ["dist/migrations/*{.ts,.js}"],
      migrationsTableName: "migrations_typeorm",
      migrationsRun: true

    }),
    AuthModule,
    UsersModule,
    TasksModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes('*');
  }
}
