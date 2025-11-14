import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Organization } from '../../entities/organization.entity';
import { UserOrganization } from '../../entities/user-organization.entity';
import { Task } from '../../entities/task.entity';
import { TaskAssignment } from '../../entities/task-assignment.entity';
import { Role, TaskStatus, TaskPriority } from '../../common/enums';
import { BcryptUtil } from '../../common/utils/bcrypt.util';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @InjectRepository(UserOrganization)
    private userOrganizationsRepository: Repository<UserOrganization>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskAssignment)
    private taskAssignmentsRepository: Repository<TaskAssignment>,
  ) {}

  async seed() {
    console.log('Starting database seeding...');

    // Check if data already exists
    const userCount = await this.usersRepository.count();
    if (userCount > 0) {
      console.log('Database already seeded. Skipping...');
      return;
    }

    // Create users
    const password = await BcryptUtil.hash('password123');

    const admin = await this.usersRepository.save({
      email: 'admin@example.com',
      passwordHash: password,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
    });

    const manager = await this.usersRepository.save({
      email: 'manager@example.com',
      passwordHash: password,
      firstName: 'Manager',
      lastName: 'Smith',
      isActive: true,
    });

    const user1 = await this.usersRepository.save({
      email: 'john.doe@example.com',
      passwordHash: password,
      firstName: 'John',
      lastName: 'Doe',
      isActive: true,
    });

    const user2 = await this.usersRepository.save({
      email: 'jane.smith@example.com',
      passwordHash: password,
      firstName: 'Jane',
      lastName: 'Smith',
      isActive: true,
    });

    console.log('Created 4 users');

    // Create organizations
    const org1 = await this.organizationsRepository.save({
      name: 'Acme Corporation',
      description: 'A leading software development company',
    });

    const org2 = await this.organizationsRepository.save({
      name: 'Tech Innovators',
      description: 'Innovation at its finest',
    });

    console.log('Created 2 organizations');

    // Add users to organizations
    await this.userOrganizationsRepository.save({
      userId: admin.id,
      organizationId: org1.id,
      role: Role.SUPER_ADMIN,
    });

    await this.userOrganizationsRepository.save({
      userId: manager.id,
      organizationId: org1.id,
      role: Role.MANAGER,
    });

    await this.userOrganizationsRepository.save({
      userId: user1.id,
      organizationId: org1.id,
      role: Role.USER,
    });

    await this.userOrganizationsRepository.save({
      userId: user2.id,
      organizationId: org1.id,
      role: Role.USER,
    });

    await this.userOrganizationsRepository.save({
      userId: user1.id,
      organizationId: org2.id,
      role: Role.MANAGER,
    });

    console.log('Added users to organizations');

    // Create tasks
    const task1 = await this.tasksRepository.save({
      title: 'Implement user authentication',
      description: 'Add JWT-based authentication to the backend API',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.HIGH,
      dueDate: new Date('2025-12-31'),
      creatorId: manager.id,
      organizationId: org1.id,
    });

    const task2 = await this.tasksRepository.save({
      title: 'Design database schema',
      description: 'Create ERD and implement database migrations',
      status: TaskStatus.DONE,
      priority: TaskPriority.HIGH,
      creatorId: admin.id,
      organizationId: org1.id,
    });

    const task3 = await this.tasksRepository.save({
      title: 'Write API documentation',
      description: 'Document all REST API endpoints using Swagger',
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
      dueDate: new Date('2025-12-15'),
      creatorId: manager.id,
      organizationId: org1.id,
    });

    const task4 = await this.tasksRepository.save({
      title: 'Setup CI/CD pipeline',
      description: 'Configure GitHub Actions for automated testing and deployment',
      status: TaskStatus.TODO,
      priority: TaskPriority.LOW,
      creatorId: user1.id,
      organizationId: org2.id,
    });

    const task5 = await this.tasksRepository.save({
      title: 'Frontend development',
      description: 'Build Angular components for task management',
      status: TaskStatus.IN_PROGRESS,
      priority: TaskPriority.URGENT,
      dueDate: new Date('2025-11-30'),
      creatorId: user1.id,
      organizationId: org2.id,
    });

    console.log('Created 5 tasks');

    // Assign tasks
    await this.taskAssignmentsRepository.save({ taskId: task1.id, userId: user1.id });
    await this.taskAssignmentsRepository.save({ taskId: task1.id, userId: user2.id });
    await this.taskAssignmentsRepository.save({ taskId: task2.id, userId: manager.id });
    await this.taskAssignmentsRepository.save({ taskId: task3.id, userId: user1.id });
    await this.taskAssignmentsRepository.save({ taskId: task4.id, userId: user1.id });
    await this.taskAssignmentsRepository.save({ taskId: task5.id, userId: user2.id });

    console.log('Assigned tasks to users');

    console.log('\n========================================');
    console.log('Seeding completed successfully!');
    console.log('========================================');
    console.log('\nTest Credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Manager: manager@example.com / password123');
    console.log('User 1: john.doe@example.com / password123');
    console.log('User 2: jane.smith@example.com / password123');
    console.log('========================================\n');
  }
}
