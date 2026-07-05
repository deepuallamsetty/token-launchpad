import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  tokenAddress!: string;

  @Column()
  owner!: string;

  @Column()
  name!: string;

  @Column()
  symbol!: string;

  @Column()
  initialSupply!: string;

  @CreateDateColumn()
  createdAt!: Date;
}