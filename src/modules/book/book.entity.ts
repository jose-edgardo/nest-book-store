import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('books')
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 500, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @ManyToMany(() => User, (user) => user.books, { eager: true })
  @JoinColumn()
  authors: User[];

  @Column({ type: 'varchar', default: 'ACTIVE', nullable: false, length: 8 })
  status: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
