
<style>
#cards {
    display: flex;
    flex-wrap: wrap;
    max-width: 100vw;
    justify-content: center;
    align-items: center;
    height: 100%;
    gap: 16px;
    width: calc(100% - 20px);
 }

 .card {
    background-color: rgba(63, 77, 100, 0.947);
    height: 30vh;
    cursor: pointer;
    border-radius: 10px;
    position: relative;
    width: 30vw;
 }

 #cards:hover > .card > .card-border {
    opacity: 1;
 }

 .card:hover::before {
    opacity: 1;
 }

 .card::before {
    background: radial-gradient(
        800px circle at var(--mouse-x) var(--mouse-y), 
        rgba(171, 155, 150, 0.06),
        transparent 40%
    );
    z-index: 3;
 }

 .card::before, 
 .card > .card-border
 {

    border-radius: inherit;
    content: "";
    height: 100%; 
    left: 0px;
    position: absolute;
    top: 0px;
    width: 100%;
    transition: opacity 500ms;
    width: 100%;
    pointer-events: none;
 }
 .card > .card-border {
    background: radial-gradient(
        400px circle at var(--mouse-x) var(--mouse-y), 
        rgba(244, 184, 33, 0.629),
        transparent 40%
    );
    z-index: 1;
 }

 .card > .card-content {
    background-color: #3f4d64;
    border-radius: inherit ;
    margin: 1px;
    height: calc(100% - 2px);
    width: calc(100% - 2px);
    position: relative;
    z-index: 2;
 }

</style>

<script lang="ts">
    import InputForm from "$lib/components/ui/inputForm.svelte";

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
    <div class="card-content">
        {#if translatedText}
            <div style="padding: 20px; color: white; overflow-y: auto; height: 100%;">
                {translatedText}
            </div>
        {:else}
            <div style="padding: 20px; color: rgba(255,255,255,0.5); text-align: center;">
                Your satirical LinkedIn post will appear here...
            </div>
        {/if}
    </div>
</div>

</div>





