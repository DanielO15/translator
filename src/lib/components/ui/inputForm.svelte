<script lang="ts">
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { AngleRightOutline } from "flowbite-svelte-icons";
    import { translateText } from "$lib/api/translate.js" ;

    let text = $state("");
    let { handleTranslation } = $props();

  

async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const result = await translateText(text);
    if (result) {
        handleTranslation(result);
    } else {
        console.error("Translation failed");
        // Optionally show an error to the user
    }
}
</script>
    
<form class="w-full h-full flex flex-col justify-end items-start" onsubmit={handleSubmit}>
<Input placeholder="Enter text here" class="w-full text-lg h-full pt-1 rounded-xl !bg-transparent border-0 text-white placeholder:text-gray-300 focus:outline-none focus:ring-0 focus:border-0 focus-visible:ring-0 focus-visible:border-0 focus:!bg-transparent" bind:value={text} />

    <Button type="submit" class="bg-transparent border-transparent hover:bg-gray-800/90 transition-colors mt-2">
        <AngleRightOutline class="h-6 w-6 text-blue-400 shrink-0"/>
        Send
    </Button>
</form>