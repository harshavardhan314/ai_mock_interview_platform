const API_URL = import.meta.env.VITE_API_URL || "/api";

export async function requestVoiceAgentResponse({ audioBlob, interviewContext }, token) {
  const audioBase64 = await blobToBase64(audioBlob);

  const response = await fetch(`${API_URL}/voice-agent/respond`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      audioBase64,
      mimeType: audioBlob.type || "audio/webm",
      interviewContext,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Voice agent request failed.");
  }

  return data;
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || "");
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = () => reject(new Error("Could not read recorded audio."));
    reader.readAsDataURL(blob);
  });
}

