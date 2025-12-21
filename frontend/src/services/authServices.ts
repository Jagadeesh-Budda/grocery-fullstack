import API_BASE_URL from "./groceryApi";

export async function loginUser(
  username: string,
  password: string
) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
    credentials: "include", // required for Spring Security
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}
