import { getCaja } from "@/app/lib/db/flujo_caja"; // ajusta la ruta al archivo real

export async function GET() {
  try {
    const caja = await getCaja();
    return new Response(JSON.stringify({ caja }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Error getting data." }), {
      status: 500,
    });
  }
}