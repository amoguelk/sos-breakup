import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Advice {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The contents of the given advice
   */
  @Column()
  message: string;

  /**
   * The amount of OpenAI tokens used to create the advice
   */
  @Column()
  tokens: number;

  /**
   * When the advice was created
   */
  @CreateDateColumn()
  created_date: Date;

  /**
   * The socket ID of the client that requested the creation of the advice
   */
  @Column()
  client_id: string;
}
