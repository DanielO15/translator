import { checkRateLimit, getRemainingTime } from '$lib/server/rateLimit';
import { checkPromptSecurity, createSecurePrompt, validateAiResponse } from '$lib/server/promptSecurity';
import { GROQ_API_KEY } from '$env/static/private';

export async function POST({ request, getClientAddress }) {
    try {
        // Rate limiting: 5 requests per minute
        const clientIp = getClientAddress();
        if (!checkRateLimit(clientIp, 5, 60000)) {
            const waitTime = getRemainingTime(clientIp);
            return new Response(
                JSON.stringify({ error: `Too many requests. Please wait ${waitTime} seconds.` }), 
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { text } = await request.json();

        // Validate text exists
        if (!text || text.trim().length === 0) {
            return new Response(
                JSON.stringify({ error: 'Text is required' }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Validate max length (2000 characters is reasonable for a LinkedIn post idea)
        const MAX_LENGTH = 2000;
        if (text.length > MAX_LENGTH) {
            return new Response(
                JSON.stringify({ error: `Text too long. Maximum ${MAX_LENGTH} characters allowed.` }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Check for prompt injection attempts
        const securityCheck = checkPromptSecurity(text);
        if (!securityCheck.safe) {
            return new Response(
                JSON.stringify({ error: securityCheck.reason }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

        try {
            // Create secure prompt with injection protection (returns chat messages array)
            const messages = createSecurePrompt(text);
            
            // Call Groq API (OpenAI-compatible, uses Llama models, FREE tier!)
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.1-8b-instant', // Fast & free Llama model
                    messages: messages,
                    temperature: 0.8, // A bit creative for satirical content
                    max_tokens: 500, // Enough for a LinkedIn post
                }),
                signal: controller.signal // ← Connect timeout to fetch
            });

            clearTimeout(timeoutId); // ← Clear timeout if request completes

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('Groq API error:', errorData);
                return new Response(
                    JSON.stringify({ error: 'AI service error. Please try again.' }), 
                    { status: 502, headers: { 'Content-Type': 'application/json' } }
                );
            }
            
            const result = await response.json();
            
            // Extract content from chat completion response
            const aiResponse = result.choices?.[0]?.message?.content;
            
            if (!aiResponse) {
                return new Response(
                    JSON.stringify({ error: 'No response from AI model' }), 
                    { status: 500, headers: { 'Content-Type': 'application/json' } }
                );
            }
            
            // Validate AI response for suspicious behavior
            const validation = validateAiResponse(aiResponse);
            if (!validation.valid) {
                console.warn(`Suspicious AI response detected: ${validation.reason}`);
                return new Response(
                    JSON.stringify({ error: 'Unable to generate appropriate content. Please try a different topic.' }), 
                    { status: 400, headers: { 'Content-Type': 'application/json' } }
                );
            }
            
            return new Response(JSON.stringify({ translation: aiResponse }), {
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (fetchError: any) {
            clearTimeout(timeoutId); // ← Clean up timeout
            
            // Check if it was a timeout abort
            if (fetchError.name === 'AbortError') {
                return new Response(
                    JSON.stringify({ error: 'Request timeout. The AI is taking too long to respond. Please try again.' }), 
                    { status: 504, headers: { 'Content-Type': 'application/json' } }
                );
            }
            
            // Other fetch errors
            throw fetchError;
        }
    } catch (error) {
        console.error('Translation error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to connect to AI service. Please try again.' }), 
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}