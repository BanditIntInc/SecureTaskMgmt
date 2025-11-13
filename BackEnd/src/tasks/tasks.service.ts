import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { TaskAssignment } from '../entities/task-assignment.entity';
import { CreateTaskDto, UpdateTaskDto, AssignTaskDto } from './dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(TaskAssignment)
    private taskAssignmentsRepository: Repository<TaskAssignment>,
  ) {}

  async create(createTaskDto: CreateTaskDto, creatorId: string): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      creatorId,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
    });
    return this.tasksRepository.save(task);
  }

  async findAll(organizationId?: string): Promise<Task[]> {
    const query = this.tasksRepository.createQueryBuilder('task')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('assignments.user', 'user')
      .leftJoinAndSelect('task.creator', 'creator');

    if (organizationId) {
      query.where('task.organizationId = :organizationId', { organizationId });
    }

    return query.getMany();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['creator', 'assignments', 'assignments.user', 'organization'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async findByUser(userId: string): Promise<Task[]> {
    return this.tasksRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignments', 'assignments')
      .leftJoinAndSelect('task.creator', 'creator')
      .where('assignments.userId = :userId', { userId })
      .orWhere('task.creatorId = :userId', { userId })
      .getMany();
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const task = await this.findOne(id);

    if (task.creatorId !== userId) {
      throw new ForbiddenException('You can only update tasks you created');
    }

    Object.assign(task, {
      ...updateTaskDto,
      dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : task.dueDate,
    });

    return this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const task = await this.findOne(id);

    if (task.creatorId !== userId) {
      throw new ForbiddenException('You can only delete tasks you created');
    }

    await this.tasksRepository.softRemove(task);
  }

  async assignTask(taskId: string, assignTaskDto: AssignTaskDto): Promise<TaskAssignment> {
    const task = await this.findOne(taskId);

    const existingAssignment = await this.taskAssignmentsRepository.findOne({
      where: {
        taskId,
        userId: assignTaskDto.userId,
      },
    });

    if (existingAssignment) {
      return existingAssignment;
    }

    const assignment = this.taskAssignmentsRepository.create({
      taskId,
      userId: assignTaskDto.userId,
    });

    return this.taskAssignmentsRepository.save(assignment);
  }

  async unassignTask(taskId: string, userId: string): Promise<void> {
    const assignment = await this.taskAssignmentsRepository.findOne({
      where: { taskId, userId },
    });

    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }

    await this.taskAssignmentsRepository.remove(assignment);
  }
}
