import OpenAI from 'openai';

type ResponseContext = {
  /**
   * An OpenAI instance, already initialized with its API key
   */
  openaiClient: OpenAI;
  /**
   * A written description of the context for the OpenAI system (eg. `'You are a chatbot that tells jokes.'`)
   */
  systemContext: string;
  /**
   * The user's prompt
   */
  prompt: string;
  /**
   * The maximum length of the user's prompt
   */
  promptMaxLength?: number;
  /**
   * The OpenAI model to use
   */
  model?: string;
  /**
   * The maximum number of tokens that can be generated in the chat completion
   */
  max_tokens?: number;
};

export const generateAIResponse = async ({
  openaiClient,
  systemContext,
  prompt,
  promptMaxLength = 500,
  model = 'gpt-3.5-turbo-0125',
  max_tokens = 1000,
}: ResponseContext) => {
  if (prompt.length > promptMaxLength) throw new Error('Prompt too long');
  const chatResponse = await openaiClient.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: systemContext,
      },
      { role: 'user', content: prompt },
    ],
    max_tokens,
  });
  const [message] = chatResponse.choices.map(
    (choice) => choice.message.content,
  );

  if (message === null || !chatResponse.usage?.total_tokens) {
    throw new Error('Error generating response');
  }

  return {
    message,
    prompt,
    tokens: chatResponse.usage?.total_tokens,
  };
};
