import { greet } from "@/lib/wasm/wasm_demo";

export async function GET() {
  const message = greet("World");
  return Response.json({ message });
}
