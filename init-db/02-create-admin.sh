#!/bin/bash
set -e

# Esperar a que MySQL esté listo si es necesario (el entrypoint original hace esto por nosotros,
# pero no está de más añadir un log)
echo "Ejecutando script dinámico para crear el usuario administrador inicial..."

# Variables necesarias, puedes pre-establecer o verificar
RUT="${INIT_ADMIN_RUT:-10000000}"
NOMBRE="${INIT_ADMIN_NAME:-Admin}"
APELLIDO_1="${INIT_ADMIN_LASTNAME:-Sistema}"
APELLIDO_2="Administrador"
PASSWORD_HASH="${INIT_ADMIN_PASSWORD:-hashed_password}"

# Comprobar que existen las variables (puedes ajustar el HASH inicial)
# En este proyecto, Prisma usa un hash como $argon2i$... entonces el usuario debería
# proveer el hash en el .env, o puedes configurarlo a un hash conocido por defecto.
mysql -h localhost -u root -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE" <<-EOSQL
    INSERT INTO Usuarios (Id_usuario, Nombre, Apellido_1, Apellido_2, Contrasena, Cargo) 
    VALUES (${RUT}, '${NOMBRE}', '${APELLIDO_1}', '${APELLIDO_2}', '${PASSWORD_HASH}', 1)
    ON DUPLICATE KEY UPDATE 
    Nombre = VALUES(Nombre), Contrasena = VALUES(Contrasena);
EOSQL

echo "Usuario ${NOMBRE} rut ${RUT} introducido exitosamente."
