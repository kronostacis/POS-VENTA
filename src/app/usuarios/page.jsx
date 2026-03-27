import ViewUsuarios from "@/components/usuarios/ViewUsuarios";
import { redirect } from "next/navigation"; // Usa esta, NO "next/dist/server/api-utils"
import { getUserFromToken } from "@/app/lib/auth";

export default async function Home() {
  const user = await getUserFromToken();

  if (!user) {
    redirect("/login"); // redirige directamente
  }

  if (user.cargo === 1) {
    return <ViewUsuarios />;
  }

  redirect("/not-found");
}
