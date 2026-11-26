import { desc } from "drizzle-orm";
import { getDb } from "../../db/index.ts";
import { notes } from "../../db/schema.ts";

export default async function handler(request: Request) {
  const fields = { name: notes.name, created_at: notes.created_at };
  const headers = { "Cache-Control": "no-store" };

  try {
    if (request.method === "GET") {
      const rows = await getDb().select(fields).from(notes).orderBy(desc(notes.id)).limit(50);
      return Response.json(rows, { headers });
    }

    if (request.method === "POST") {
      const contentType = request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase();
      if (contentType !== "application/json") {
        return Response.json({ error: "JSON formatida yuboring." }, { status: 415, headers });
      }

      const body = await request.json().catch(() => null);
      const name = typeof body?.name === "string" ? body.name.trim() : "";
      if (!name || name.length > 100) {
        return Response.json({ error: "Ism 1–100 belgidan iborat bo‘lishi kerak." }, { status: 400, headers });
      }

      const [saved] = await getDb().insert(notes).values({ name }).returning(fields);
      return Response.json(saved, { status: 201, headers });
    }

    return Response.json({ error: "Bu so‘rov usuli qo‘llab-quvvatlanmaydi." }, {
      status: 405,
      headers: { ...headers, Allow: "GET, POST" },
    });
  } catch {
    return Response.json({ error: "Server xatosi." }, { status: 500, headers });
  }
}
