import { IsNotEmpty } from 'class-validator';

export class PlaylistDto {
  /**
   * The contents of the given playlist
   */
  @IsNotEmpty()
  message: string;

  /**
   * The user's prompt
   */
  @IsNotEmpty()
  prompt: string;

  /**
   * The amount of OpenAI tokens used to create the playlist
   */
  @IsNotEmpty()
  tokens: number;

  /**
   * The socket ID of the client that requested the creation of the playlist
   */
  client_id: string;
}
