import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MovieList {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The contents of the given movie list
   */
  @Column()
  message: string;

  /**
   * The user's prompt
   */
  @Column()
  prompt: string;

  /**
   * The amount of OpenAI tokens used to create the movie list
   */
  @Column()
  tokens: number;

  /**
   * When the movie list was created
   */
  @CreateDateColumn()
  created_date: Date;

  /**
   * The socket ID of the client that requested the creation of the movie list
   */
  @Column()
  client_id: string;
}
