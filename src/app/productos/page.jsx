import ViewProductos from "@/components/productos/ViewProductos";
import { redirect } from "next/navigation"; // Usa esta, NO "next/dist/server/api-utils"
import { getUserFromToken } from "@/app/lib/auth";

export default async function Home() {
  const user = await getUserFromToken();

  if (!user) {
    redirect("/login"); // redirige directamente
  }

  if (user.cargo === 1 || user.cargo === 2 || user.cargo === 3) {
    return <ViewProductos userRole={user.cargo} />;
  }

  redirect("/not-found");
}
