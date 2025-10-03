<script lang="ts">
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "flowbite-svelte";
    import { ForwardOutline } from "flowbite-svelte-icons";
    import { translateText } from "$lib/api/translate.js" ;

    let text = $state("");
    let { handleTranslation } = $props();

  

async function handleSubmit(event) {
    event.preventDefault();
    const result = await translateText(text);
    handleTranslation(result)
}
</script>
    
<form class="w-full h-full" on:submit={handleSubmit}>
   <Input  placeholder="Enter text here" class='w-full pl-10 pt-1 radius rounded-2xl bg-transparent  text-white border-transparent h-auto' bind:value={text} />

    <Button type="submit" class="">
        <ForwardOutline class="shrink-0 h-6 w-6" />  Send
    </Button>
</form>