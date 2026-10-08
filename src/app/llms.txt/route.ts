import { buildLlms } from "@/lib/llms";

export const dynamic = "force-static";

export async function GET() {
  return new Response(await buildLlms(false), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
