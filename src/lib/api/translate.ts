
export async function translateText(submittedText: string){
const response = await fetch("/api/translate", {
    headers: {
      "Content-Type": "application/json"
    },
    method: "POST",
    body: JSON.stringify({ text: submittedText }),
  });
  const data = await response.json();



}


