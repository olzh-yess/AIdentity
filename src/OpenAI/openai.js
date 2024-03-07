import OpenAI from "openai";

export async function parseOpenAI(user_text) {
    const apiKey = process.env.REACT_APP_OPEN_AI_KEY;

    const openai = new OpenAI({apiKey, dangerouslyAllowBrowser: true});

    // Function to add a new message and get a response
    async function addMessageAndGetResponse(userInput) {
        // Add user message
        messages.push({ role: "user", content: userInput });

        // Call OpenAI API with updated messages
        const completion = await openai.chat.completions.create({
            messages: messages,
            model: "gpt-4-1106-preview",
        });

        // Add assistant response
        const assistantResponse = completion.choices[0].message.content;
        messages.push({ role: "assistant", content: assistantResponse });

        return assistantResponse;
    }

    // Initial system message
    const messages = [{ role: "system", content: "You are a helpful assistant." }];

    // Example usage
    let userMessage = `In the paragraph provided below, which words or phrases manifest most negative emotion or stressors.
    Paragraph:` + user_text;
    let response = await addMessageAndGetResponse(userMessage);

    userMessage = `How would you paraphrase each of the previously identified phrases on a lexical chunk level so that it would result in cognitive reappraisal of the situation, but still follow the original storyline.`;
    response = await addMessageAndGetResponse(userMessage);

    console.log(response);

    userMessage = `Reformat your previous response in the JSON format (no other words or markers needed) - a list of JSON objects with phrase - paraphrase keys. 
    The output string needs to be directly parseable by JSON.parse()`;
    response = await addMessageAndGetResponse(userMessage);

    return JSON.parse(response);

    // Add more interactions here as needed
}

