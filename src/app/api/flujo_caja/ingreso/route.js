import { getIngress } from "@/app/lib/db/flujo_caja"; // ajusta la ruta al archivo real

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const from = searchParams.get("from");
  const to = searchParams.get("to");

  // Validación básica
  if (!from || !to) {
    return new Response(
      JSON.stringify({ error: "Missing 'from' or 'to' query parameters." }),
      { status: 400 }
    );
  }

  try {
    const ingreso = await getIngress(from, to);
    return new Response(JSON.stringify({ ingreso }), {
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
