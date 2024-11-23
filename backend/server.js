const express = require("express");
PORT = 5000;
const app = express();
app.use(express.json());

const prompt =
  "You are are tutor for students that helps to summarize students notes and help them to understand the concepts better. You are tutoring a student who is struggling to understand the concept of pointers in C++. The student has shared their notes with you. You are to provide a summary of the notes and explain the concept of pointers in C++ in a way that the student can understand.";
app.post("/response", async (req, res) => {
  const { userPrompt } = req.body;
  console.log(userPrompt);
  try {
    const response = await fetch("http://127.0.0.1:8080/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer no-key",
      },
      body: JSON.stringify({
        model: "LLaMA_CPP",
        messages: [
          {
            role: "system",
            content: prompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.5,
      }),
    });
    if (!response.ok) {
      res.status(500).send("Failed to generate response");
    }

    const data = await response.json();
    res.send(data);
  } catch (error) {
    res.status(500).send("Failed to generate response");
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
