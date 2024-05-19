import { Entity, PrimaryGeneratedColumn, OneToMany, Column } from 'typeorm';
import { Board } from 'src/boards/board.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  // Creates relation 1 - n
  @OneToMany(() => Board, (board) => board.user)
  boards: Board[];
}
