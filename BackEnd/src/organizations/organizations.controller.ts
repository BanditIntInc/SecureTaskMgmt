import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto, AddUserToOrgDto } from './dto';
import { JwtAuthGuard } from '../auth/guards';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('organizations')
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  create(@Body() createOrganizationDto: CreateOrganizationDto) {
    return this.organizationsService.create(createOrganizationDto);
  }

  @Get()
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.organizationsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  update(@Param('id') id: string, @Body() updateOrganizationDto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, updateOrganizationDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.organizationsService.remove(id);
  }

  @Post(':id/users')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  addUser(@Param('id') organizationId: string, @Body() addUserDto: AddUserToOrgDto) {
    return this.organizationsService.addUserToOrganization(organizationId, addUserDto);
  }

  @Delete(':id/users/:userId')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN, Role.ORG_ADMIN)
  removeUser(@Param('id') organizationId: string, @Param('userId') userId: string) {
    return this.organizationsService.removeUserFromOrganization(organizationId, userId);
  }
}
