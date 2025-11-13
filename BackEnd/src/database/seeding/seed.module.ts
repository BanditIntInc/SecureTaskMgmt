import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../../entities/user.entity';
import { Organization } from '../../entities/organization.entity';
import { UserOrganization } from '../../entities/user-organization.entity';
import { Task } from '../../entities/task.entity';
import { TaskAssignment } from '../../entities/task-assignment.entity';
import { SeedService } from './seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forFeature([
      User,
      Organization,
      UserOrganization,
      Task,
      TaskAssignment,
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
