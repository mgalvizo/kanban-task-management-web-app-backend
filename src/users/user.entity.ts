import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { Board } from '../boards/board.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  // Set to false in production
  @Column({ default: true })
  isAdmin: boolean;

  // Creates relation 1 - n
  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];
}
