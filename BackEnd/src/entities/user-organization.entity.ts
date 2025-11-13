import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Organization } from './organization.entity';
import { Role } from '../common/enums';

@Entity('user_organizations')
export class UserOrganization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  organizationId: string;

  @Column({
    type: 'varchar',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @CreateDateColumn()
  joinedAt: Date;

  // Relations
  @ManyToOne(() => User, (user) => user.userOrganizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Organization, (org) => org.userOrganizations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'organizationId' })
  organization: Organization;
}
