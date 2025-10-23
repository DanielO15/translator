<script lang="ts">
    import InputForm from "$lib/components/ui/inputForm.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import { ClipboardOutline } from "flowbite-svelte-icons";
    import './home.css';
    import Loading from "$lib/components/ui/loading.svelte";
    let cardsEl: HTMLElement | null = null;
    let translatedText = $state("");
    let isLoading = $state(false);
    let showToast = $state(false);
  
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
        isLoading = false;
        console.log(result);
    }

    function handleLoadingStart() {
        isLoading = true;
        translatedText = "";
    }

function handleCopy() {
    navigator.clipboard.writeText(translatedText);
    showToast = true;
    setTimeout(() => showToast = false, 2000);
}
</script>

{#if showToast}
    <div class="fixed bottom-4 right-4 bg-green-300 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50">
        ✓ Copied to clipboard!
    </div>
{/if}

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div id="cards" bind:this={cardsEl} onmousemove={handleMouseMove}>
    <div class="card">
        <div class="card-border"> </div>
        <div class="card-content">
            <InputForm handleTranslation={handleTranslation} handleLoadingStart={handleLoadingStart} />
        </div>
    </div>
   <div class="card">
    <div class="card-border"></div>
    <div class="card-content flex flex-col justify-between items-start">
        {#if isLoading}
            <div class="flex-1 flex items-center justify-center w-full">
                <Loading />
            </div>
        {:else if translatedText}
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
            <ClipboardOutline class="h-6 w-6 text-blue-400 shrink-0"/>
            Copy
        </Button>
    </div>
</div>

</div>





