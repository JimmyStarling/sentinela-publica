export class UserEntity {}
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 254 })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'text', nullable: true, select: false })
  refreshTokenHash: string | null;

  @Column({ type: 'text', nullable: true, select: false })
  passwordResetTokenHash: string | null;

  @Column({ type: 'timestamp', nullable: true, select: false })
  passwordResetExpiresAt: Date | null;

  @Column({ type: 'text', nullable: true, select: false })
  emailVerificationTokenHash: string | null;

  @Column({ type: 'timestamp', nullable: true, select: false })
  emailVerificationExpiresAt: Date | null;
}