import ViewLotes from "@/components/lote_productos/ViewLotes";
import { redirect } from "next/navigation"; // Usa esta, NO "next/dist/server/api-utils"
import { getUserFromToken } from "@/app/lib/auth";

export default async function Home() {
  const user = await getUserFromToken();

  if (!user) {
    redirect("/login"); // redirige directamente
  }

  if (user.cargo === 1 || user.cargo === 2) {
    return <ViewLotes />;
  }

  redirect("/not-found");
}
