import { IsNotEmpty } from 'class-validator';

export class MovieListDto {
  /**
   * The contents of the given movie list
   */
  @IsNotEmpty()
  message: string;

  /**
   * The user's prompt
   */
  @IsNotEmpty()
  prompt: string;

  /**
   * The amount of OpenAI tokens used to create the movie list
   */
  @IsNotEmpty()
  tokens: number;

  /**
   * The socket ID of the client that requested the creation of the movie list
   */
  client_id: string;
}
