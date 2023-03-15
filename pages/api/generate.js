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

  const messages = req.body.messages || '';
  if (messages.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid value",
      }
    });
    return;
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "user", "content": messages}
      ],
    });
    const responseData = response.data.choices[0].message.content.trim().replace(/^"|"$/g, '');
    res.status(200).json({ result: JSON.parse(JSON.stringify(responseData)) });
  } catch(error) {
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