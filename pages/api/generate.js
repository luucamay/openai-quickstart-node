import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const question = req.body.animal || '';
  if (question.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a question",
      }
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { "role": "system", "content": "Take on the persona of Jonathan Burrows for the rest of this conversation" },
        { "role": "user", "content": `Answer with a paragraph of max 100 characters"${question}"` }
      ],
      max_tokens: 150
    })
    console.log(completion.data.choices[0].message.content);
    res.status(200).json({ result: completion.data.choices[0].message.content });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(artist) {
  const capitalizedArtist =
    artist[0].toUpperCase() + artist.slice(1).toLowerCase();
  return `Take on the persona of ${capitalizedArtist} for the rest of this conversation.`
}