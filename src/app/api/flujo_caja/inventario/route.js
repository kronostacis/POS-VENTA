import { getInventory } from "@/app/lib/db/flujo_caja"; // ajusta la ruta al archivo real

export async function GET() {
  try {
    const inventario = await getInventory();
    return new Response(JSON.stringify({ inventario }), {
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