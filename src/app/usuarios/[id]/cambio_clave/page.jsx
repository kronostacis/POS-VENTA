import { getUserFromToken } from "@/app/lib/auth";
import { notFound, redirect } from "next/navigation";
import FormCambioClave from "@/components/usuarios/FormCambioClave";

export default async function CambioClavePage({ params }) {
  const user = await getUserFromToken();
  const { id } = await params; // ✅ Ahora con await

  if (!user) {
    redirect("/login");
  }

  // Validar que id exista y sea string
  if (!id || typeof id !== "string") {
    notFound();
  }

  const idFromUrl = id;
  const idFromToken = user.id.toString();

  if (idFromUrl !== idFromToken) {
    notFound();
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Cambiar Contraseña
      </h2>
      <FormCambioClave userId={user.Id_usuario} />
    </div>
  );
}
