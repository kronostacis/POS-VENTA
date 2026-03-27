import EditMedioPagos from "@/components/medio_pago/EditMedioPagos";
import { redirect } from "next/navigation";
import { getUserFromToken } from "@/app/lib/auth";

export default async function Home({ params }) {
  const user = await getUserFromToken();

  if (!user) {
    redirect("/login");
  }

  if (user.cargo === 1 || user.cargo === 2) {
    return <EditMedioPagos id={params.id} />;
  }

  redirect("/not-found");
}
