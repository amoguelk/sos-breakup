import { IsNotEmpty } from 'class-validator';

export class AdviceDto {
  /**
   * The contents of the given advice
   */
  @IsNotEmpty()
  message: string;

  /**
   * The user's prompt
   */
  @IsNotEmpty()
  prompt: string;

  /**
   * The amount of OpenAI tokens used to create the advice
   */
  @IsNotEmpty()
  tokens: number;

  /**
   * The socket ID of the client that requested the creation of the advice
   */
  client_id: string;
}
