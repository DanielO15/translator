<script lang="ts">
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { AngleRightOutline } from "flowbite-svelte-icons";
    import { translateText } from "$lib/api/translate.js" ;

    let text = $state("");
    let { handleTranslation, handleLoadingStart } = $props();
    let error = $state("");
    
    const MIN_LENGTH = 5;
    const MAX_LENGTH = 2000;

async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    
    // Validate minimum length
    if (text.trim().length < MIN_LENGTH) {
        error = `Please enter at least ${MIN_LENGTH} characters`;
        return;
    }

    // Validate maximum length
    if (text.length > MAX_LENGTH) {
        error = `Text too long. Maximum ${MAX_LENGTH} characters allowed.`;
        return;
    }
    
    error = "";
    handleLoadingStart();
    
    try {
        const result = await translateText(text);
        handleTranslation(result);
    } catch (err: any) {
        console.error("Translation failed:", err);
        error = err.message || "Translation failed. Please try again.";
        handleTranslation(""); // Reset loading state on error
    }
}

function handleInput() {
    // Clear error if user fixes the issue
    if (error) {
        if (text.trim().length >= MIN_LENGTH && text.length <= MAX_LENGTH) {
            error = "";
        }
    }
}
</script>
    
<form class="w-full h-full flex flex-col justify-end items-start" onsubmit={handleSubmit}>
<Input 
    placeholder="Enter text here" 
    class="w-full text-lg h-full pt-1 rounded-xl !bg-transparent border-0 text-white placeholder:text-gray-300 focus:outline-none focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:border-0 focus:!bg-transparent" 
    bind:value={text}
    oninput={handleInput}
    aria-invalid={error ? true : undefined}
/>

{#if error}
    <p class="text-red-400 text-sm mt-1">{error}</p>
{/if}

<p class="text-gray-400 text-xs mt-1">
    {text.length} / {MAX_LENGTH} characters
</p>

    <Button type="submit" class="bg-transparent border-transparent hover:bg-gray-800/90 transition-colors mt-2">
        <AngleRightOutline class="h-6 w-6 text-blue-400 shrink-0"/>
        Send
    </Button>
</form>