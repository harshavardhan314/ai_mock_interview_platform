const API_URL = import.meta.env.VITE_API_URL || "/api";

async function parseResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Interview API request failed.");
  }
  return data;
}

export async function listInterviews() {
  const response = await fetch(`${API_URL}/interviews`);
  return parseResponse(response);
}

export async function createInterview(formData) {
  const response = await fetch(`${API_URL}/interviews`, {
    method: "POST",
    body: formData,
  });

  return parseResponse(response);
}

export async function getInterview(interviewId) {
  const response = await fetch(`${API_URL}/interviews/${interviewId}`);
  return parseResponse(response);
}

export async function startInterview(interviewId) {
  const response = await fetch(`${API_URL}/interviews/${interviewId}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  return parseResponse(response);
}

export async function saveInterviewAnswer(interviewId, answer) {
  const response = await fetch(`${API_URL}/interviews/${interviewId}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answer }),
  });

  return parseResponse(response);
}

export async function completeInterview(interviewId) {
  const response = await fetch(`${API_URL}/interviews/${interviewId}/complete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  return parseResponse(response);
}
