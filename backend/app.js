require("dotenv").config();
const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

// Initialize express app
const app = express();

// Middleware
app.use(express.json());

// Initialize OpenAI configuration and API objects
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Set server port
const port = process.env.PORT || 5000;

// Define endpoint for asking OpenAI questions
app.post("/ask", async (req, res) => {
  const { messages } = req.body;
  
  // Throw error if no messages are provided
  if (!messages) {
    return res.status(400).json({ error: "No messages provided" });
  }
  
  // Ask OpenAI for a completion
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
    });
    const completion = response.data.choices[0].message.content;
    console.log("completion", completion)
    return res.status(200).json({
      success: true,
      message: completion,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Server error" });
  }
});

// Start server
app.listen(port, () => console.log(`Server is running on port ${port}!!`));