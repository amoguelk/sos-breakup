import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * The contents of the given playlist
   */
  @Column()
  message: string;

  /**
   * The user's prompt
   */
  @Column()
  prompt: string;

  /**
   * The amount of OpenAI tokens used to create the playlist
   */
  @Column()
  tokens: number;

  /**
   * When the playlist was created
   */
  @CreateDateColumn()
  created_date: Date;

  /**
   * The socket ID of the client that requested the creation of the playlist
   */
  @Column()
  client_id: string;
}
