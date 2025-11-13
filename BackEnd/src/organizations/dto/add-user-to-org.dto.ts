import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Role } from '../../common/enums';

export class AddUserToOrgDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
