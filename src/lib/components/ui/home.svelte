<script lang="ts">
    import InputForm from "$lib/components/ui/inputForm.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import { ClipboardOutline } from "flowbite-svelte-icons";
    import './home.css';

    let cardsEl: HTMLElement | null = null;
    let translatedText = $state("");
  
    function handleMouseMove(e: MouseEvent) {
      if (!cardsEl) return;
      for (const card of cardsEl.getElementsByClassName('card')) {
        const rect = (card as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
        (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
      }
    }

    function handleTranslation(result: string) {
        translatedText = result;

        console.log(result);
}

function handleCopy() {
    navigator.clipboard.writeText(translatedText);
}
</script>



<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="cards" bind:this={cardsEl} onmousemove={handleMouseMove}>
    <div class="card">
        <div class="card-border"> </div>
        <div class="card-content">
            <InputForm handleTranslation={handleTranslation} />
        </div>
    </div>
   <div class="card">
    <div class="card-border"></div>
    <div class="card-content flex flex-col justify-between items-start">
        {#if translatedText}
            <div class="h-full overflow-y-auto w-full">
                {translatedText}
            </div>
        {:else}
            <div class="flex-1 flex items-center justify-center w-full">
                <p class="text-gray-300 text-sm">
                    Your satirical LinkedIn post will appear here...
                </p>
            </div>
        {/if}
        <Button onclick={handleCopy} class="bg-transparent border-transparent hover:bg-gray-800/90 transition-colors self-start">
            <ClipboardOutline class="h-6 w-6 text-gray-100 shrink-0"/>
        </Button>
    </div>
</div>

</div>





