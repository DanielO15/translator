export async function translateText(submittedText: string) {
  try {
    const response = await fetch("/api/translate", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ text: submittedText }),
    });
    if (!response.ok) {
      throw new Error("Failed to translate text");
    }
    
    const data = await response.json();
    return data.translation;
  } catch (error) {
    console.error("Error translating text:", error);
    return null;
  }
}
