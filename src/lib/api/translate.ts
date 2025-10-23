export async function translateText(submittedText: string) {
  try {
    const response = await fetch("/api/translate", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ text: submittedText }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || "Failed to translate text");
    }
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    return data.translation;
  } catch (error) {
    console.error("Error translating text:", error);
    throw error; // Re-throw so inputForm can handle it
  }
}
