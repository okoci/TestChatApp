const CLIENT_ID_STORAGE_KEY = "chat-client-id";

export function getOrCreateClientId(): string {
  const existingClientId = window.localStorage.getItem(CLIENT_ID_STORAGE_KEY);

  if (existingClientId) {
    return existingClientId;
  }

  const clientId = crypto.randomUUID();
  window.localStorage.setItem(CLIENT_ID_STORAGE_KEY, clientId);
  return clientId;
}
