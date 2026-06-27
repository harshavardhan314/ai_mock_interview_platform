const API_URL = import.meta.env.VITE_API_URL || "/api";

async function parseResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Interview API request failed.");
  }
  return data;
}

export async function listInterviews(token) {
  const response = await fetch(`${API_URL}/interviews`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return parseResponse(response);
}

export async function createInterview(formData, token) {
  const response = await fetch(`${API_URL}/interviews`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return parseResponse(response);
}

export async function getInterview(interviewId, token) {
  const response = await fetch(`${API_URL}/interviews/${interviewId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return parseResponse(response);
}

export async function startInterview(interviewId, token) {
  const response = await fetch(`${API_URL}/interviews/${interviewId}/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}

export async function saveInterviewAnswer(interviewId, answer, token) {
  const response = await fetch(`${API_URL}/interviews/${interviewId}/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ answer }),
  });

  return parseResponse(response);
}

export async function completeInterview(interviewId, token) {
  const response = await fetch(`${API_URL}/interviews/${interviewId}/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return parseResponse(response);
}
