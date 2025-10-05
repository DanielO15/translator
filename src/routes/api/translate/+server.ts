export async function POST({ request }) {
    const { text } = await request.json();

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2',
        prompt: `Create a satirical LinkedIn post about: ${text}. Make it over-the-top with buzzwords and humble brags. Keep it under 200 words.`,
        stream: false
      }),
    });
    
    const result = await response.json();
    const generatedText = result.response || "Failed to generate";
    
    return new Response(JSON.stringify({ translation: generatedText }), {
        headers: { 'Content-Type': 'application/json' }
    });
}