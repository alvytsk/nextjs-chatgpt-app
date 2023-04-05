import type { NextApiRequest, NextApiResponse } from 'next';
import { ChatCompletionResponseMessage, Configuration, OpenAIApi } from 'openai';

type ResponseData = {
  text: ChatCompletionResponseMessage | undefined;
};

interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    message: string;
  };
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

export async function POST(req: GenerateNextApiRequest, res: NextApiResponse<ResponseData>) {
  const body = await (req as unknown as Request).json();
  const { message } = body;

  console.log(message);

  if (!message || message === '') {
    return new Response('Message is empty', { status: 400 });
  }

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
    // the maximum number of tokens/words the bot should return
    // in response to a given prompt
    max_tokens: 100
  });

  console.log(completion.data.choices[0].message);

  return res.status(200).json({ text: completion.data.choices[0].message });
}
