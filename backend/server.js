const express = require('express');
const cors = require('cors');
require('dotenv').config();
const Groq = require('groq-sdk');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('HiDoctor backend is running');
});

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are HiDoctor, a helpful medical triage assistant for a clinic. 
Your job is to:
- Listen to patients describe their symptoms
- Ask clarifying questions when needed
- Provide general guidance on the severity of symptoms
- Recommend whether they should: handle it at home, book an appointment, or go to emergency
- Always remind users you are not a doctor and they should seek professional medical advice
- Be empathetic, clear, and concise
- Never diagnose. Only provide general guidance.`;

app.post('/chat', async (req, res) => {
  const { messages } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error('Groq error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});