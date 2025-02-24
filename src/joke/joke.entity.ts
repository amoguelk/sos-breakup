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
  @Column({ type: 'varchar', length: 1000 })
  message: string;

  /**
   * The user's prompt
   */
  @Column({ type: 'varchar', length: 500 })
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
