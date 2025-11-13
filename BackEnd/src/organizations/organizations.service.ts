import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { UserOrganization } from '../entities/user-organization.entity';
import { CreateOrganizationDto, UpdateOrganizationDto, AddUserToOrgDto } from './dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private organizationsRepository: Repository<Organization>,
    @InjectRepository(UserOrganization)
    private userOrganizationsRepository: Repository<UserOrganization>,
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto): Promise<Organization> {
    const organization = this.organizationsRepository.create(createOrganizationDto);
    return this.organizationsRepository.save(organization);
  }

  async findAll(): Promise<Organization[]> {
    return this.organizationsRepository.find();
  }

  async findOne(id: string): Promise<Organization> {
    const organization = await this.organizationsRepository.findOne({ where: { id } });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async update(id: string, updateOrganizationDto: UpdateOrganizationDto): Promise<Organization> {
    const organization = await this.findOne(id);
    Object.assign(organization, updateOrganizationDto);
    return this.organizationsRepository.save(organization);
  }

  async remove(id: string): Promise<void> {
    const organization = await this.findOne(id);
    await this.organizationsRepository.remove(organization);
  }

  async addUserToOrganization(organizationId: string, addUserDto: AddUserToOrgDto): Promise<UserOrganization> {
    await this.findOne(organizationId);

    const existingUserOrg = await this.userOrganizationsRepository.findOne({
      where: {
        userId: addUserDto.userId,
        organizationId,
      },
    });

    if (existingUserOrg) {
      throw new BadRequestException('User already belongs to this organization');
    }

    const userOrganization = this.userOrganizationsRepository.create({
      userId: addUserDto.userId,
      organizationId,
      role: addUserDto.role,
    });

    return this.userOrganizationsRepository.save(userOrganization);
  }

  async removeUserFromOrganization(organizationId: string, userId: string): Promise<void> {
    const userOrganization = await this.userOrganizationsRepository.findOne({
      where: { userId, organizationId },
    });

    if (!userOrganization) {
      throw new NotFoundException('User is not a member of this organization');
    }

    await this.userOrganizationsRepository.remove(userOrganization);
  }

  async getUserOrganizations(userId: string): Promise<UserOrganization[]> {
    return this.userOrganizationsRepository.find({
      where: { userId },
      relations: ['organization'],
    });
  }
}
