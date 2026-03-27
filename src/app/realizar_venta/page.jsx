import RealizarVenta from "@/components/realizar_venta/ViewCaja";
import { redirect } from "next/navigation";
import { getUserFromToken } from "@/app/lib/auth";

export default async function Home() {
  const user = await getUserFromToken();

  if (!user) {
    redirect("/login");
  }

  if (user.cargo === 1 || user.cargo === 2 || user.cargo === 3) {
    return <RealizarVenta id={user.id} />;
  }

  redirect("/not-found");
}
