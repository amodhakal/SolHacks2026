"use server"

import { headers } from "next/headers";

export async function submitIntakeForm(formData: FormData) {
  const data = Object.fromEntries(formData);
  
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  
  const response = await fetch(`${protocol}://${host}/api/intake`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  return response.json();
}
