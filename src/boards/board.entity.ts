import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { List } from '../lists/list.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Creates relation 1 - n
  @OneToMany(() => List, (list) => list.board)
  lists: List[];
}
