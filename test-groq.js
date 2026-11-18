require("dotenv").config();

const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function testGroq() {
  try {
    console.log("Testing Groq connection...");
    console.log("Model:", process.env.GROQ_MODEL);

    const response = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL,
      messages: [
        {
          role: "user",
          content: "Explain JavaScript Event Loop in one sentence.",
        },
      ],
      max_completion_tokens: 200,
    });

    console.log("Groq connected successfully!");
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error("Groq request failed");
    console.error("Status:", error.status);
    console.error("Message:", error.message);
    console.error("Code:", error.code);
  }
}

testGroq();
