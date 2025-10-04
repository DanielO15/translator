import { HF_TOKEN } from '$env/static/private'; 

export async function POST({ request }) {
    const { text } = await request.json();

    const response = await fetch(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-2-7b-chat-hf',
      {
        headers: {
          'Authorization': `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          inputs: `Create a satirical LinkedIn post about: ${text}. Make it over-the-top with buzzwords and humble brags.`,hh
        }),
      }
    );
    
    // Log the response to see what we're getting
    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText);
    
    // Try to parse it
    const result = JSON.parse(responseText);
    const generatedText = result[0]?.generated_text || "Failed to generate";
    
    return new Response(JSON.stringify({ translation: generatedText }), {
        headers: { 'Content-Type': 'application/json' }
    });
}