import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcards.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single topic or concept.
4. Use simple language and avoid using jargon.
5. Use bullet points or numbered lists to break down complex information.
6. Use the present tense to describe facts or concepts.
7. Use the past tense to describe historical events.
8. Avoid overly complex or ambiguous phrasing in both questions and answers.
9. When appropriate, use mnemonic devices or memory aids to help learners remember information.
10. Tailor the difficulty level of the flashcards to the user's specified preferences.
11. If given a body of text, extract the most important and relevant information for the flashcards.
12. Aim to create a balanced set of flashcards that covers the topic comprehensively.
13. Only generate 10 flashcards at a time.

Return in the following JSON format:
{
    "flashcards": [
        {
        "front": "string",
        "back": "string"
        }
    ]
}
`;

export async function POST(req) {
    const openai = new OpenAI()
    const data = await req.text();

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data },
      ],
      model: 'gpt-4o-mini', 
      response_format: {type: 'json_object'},
    });

    console.log(completion.choices[0].message.content);

    const flashcards = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json(flashcards.flashcards);

}