import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Joke {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The contents of the given joke
   */
  @Column()
  message: string;

  /**
   * The user's prompt
   */
  @Column()
  prompt: string;

  /**
   * The amount of OpenAI tokens used to create the joke
   */
  @Column()
  tokens: number;

  /**
   * When the joke was created
   */
  @CreateDateColumn()
  created_date: Date;

  /**
   * The socket ID of the client that requested the creation of the joke
   */
  @Column()
  client_id: string;
}
