import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

type ResponseData = { text: string };

interface GenerateNextApiRequest extends NextApiRequest {
  body: {
    prompt: string;
  };
}

const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    if (req.method !== "POST") {
      res.status(405).send({ text: "Only POST requests allowed" });
      return;
    }

    const prompt = req.body.prompt;

    if (!prompt || prompt === "")
      return new Response("please send your prompt", { status: 400 });

    const aiResult = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0.9,
      max_tokens: 2048,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    const response =
      aiResult.data.choices[0].text?.trim() || "Sorry, there was a problem!";
    res.status(200).json({ text: response });
  } catch (e: any) {
    console.log("error", e?.response.data.error);
  }
}

// export async function GET(request: Request) {
//   return new Response("Hello, Next.js!");
// }
