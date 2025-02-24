import { IsNotEmpty } from 'class-validator';

export class JokeDto {
  /**
   * The contents of the given joke
   */
  @IsNotEmpty()
  message: string;

  /**
   * The user's prompt
   */
  @IsNotEmpty()
  prompt: string;

  /**
   * The amount of OpenAI tokens used to create the joke
   */
  @IsNotEmpty()
  tokens: number;

  /**
   * The socket ID of the client that requested the creation of the joke
   */
  client_id: string;
}
