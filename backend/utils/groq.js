import dotenv from "dotenv";
import Groq from "groq-sdk";

const getGroqResponse = async (input) => {
    try {
        const groq = new Groq({
            apiKey: process.env.SIGMAGPT_API_KEY
        });
        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "user",
                    content: input
                }
            ]
        });

        return response.choices[0].message.content;

    } catch(err) {
        console.log(err);
    }
}

export default getGroqResponse;