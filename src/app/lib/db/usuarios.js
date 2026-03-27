import prisma from "@/app/lib/prisma";

export async function getAllUsers() {
  const q = await prisma.usuarios.findMany({
    select: {
      Id_usuario: true,
      Nombre: true,
      Apellido_1: true,
      Apellido_2: true,
      Cargo: true,
      Id_estado_usuario: true,
    },
  });

  return q;
}

export async function createUser(data) {
  const { Id_usuario, Nombre, Apellido_1, Apellido_2, Contrasena, Cargo } =
    data;

  const user = await prisma.usuarios.create({
    data: {
      Id_usuario,
      Nombre,
      Apellido_1,
      Apellido_2,
      Contrasena,
      Cargo,
    },
  });

  return user;
}

export async function getUserById(id) {
  const user = await prisma.usuarios.findUnique({
    where: { Id_usuario: id },
    select: {
      Id_usuario: true,
      Nombre: true,
      Apellido_1: true,
      Apellido_2: true,
      Cargo: true,
      Id_estado_usuario: true,
    },
  });

  return user;
}

export async function userExist(id) {
  const user = await prisma.usuarios.findUnique({
    where: { Id_usuario: id },
    select: {
      Id_usuario: true,
    },
  });

  return user;
}

export async function getUserHashById(id) {
  const user = await prisma.usuarios.findUnique({
    where: { Id_usuario: id },
    select: {
      Id_usuario: true,
      Contrasena: true,
    },
  });

  return user;
}

export async function deleteUserById(id) {
  try {
    const user = await prisma.usuarios.delete({
      where: {
        Id_usuario: id,
      },
    });
    return { success: true, user: user };
  } catch (error) {
    return { success: false, message: "No se pudo eliminar el usuario" };
  }
}

export async function updateUserById(id, data) {
  try {
    const { Id_usuario, Nombre, Apellido_1, Apellido_2, Contrasena, Cargo } =
      data;
    const user = await prisma.usuarios.update({
      where: { Id_usuario: id },
      data: {
        Nombre: data.Nombre,
        Apellido_1: data.Apellido_1,
        Apellido_2: data.Apellido_2,
        Cargo: data.Cargo,
      },
    });

    return { success: true, user: user };
  } catch (errors) {
    console.log(errors);
    return { success: false, message: "No se pudo actualizar el usuario" };
  }
}

export async function updatePasswordUserById(id, data) {
  try {
    const { Contrasena } = data;
    const user = await prisma.usuarios.update({
      where: { Id_usuario: id },
      data: {
        Contrasena: Contrasena,
      },
    });

    return { success: true, user: user };
  } catch (errors) {
    console.log(errors);
    return {
      success: false,
      message: "No se pudo actualizar contraseña de usuario",
    };
  }
}

export async function updateUserStateById(id, state) {
  try {
    const user = await prisma.usuarios.update({
      where: { Id_usuario: id },
      data: { Id_estado_usuario: state },
    });

    return { success: true, user: user };
  } catch (error) {
    console.error("Error al actualizar el estado del usuario:", error);
    return {
      success: false,
      message: "No se pudo actualizar el estado del usuario",
    };
  }
}
