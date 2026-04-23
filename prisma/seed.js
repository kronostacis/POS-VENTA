const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('--- Starting Seeding Process ---');

  // 1. Initial Master Data
  console.log('Populating master data...');

  await prisma.cargos.upsert({
    where: { Id_cargo: 1 },
    update: {},
    create: { Id_cargo: 1, Nombre_cargo: 'Administrador' },
  });
  await prisma.cargos.upsert({
    where: { Id_cargo: 2 },
    update: {},
    create: { Id_cargo: 2, Nombre_cargo: 'Cajero' },
  });
  await prisma.cargos.upsert({
    where: { Id_cargo: 3 },
    update: {},
    create: { Id_cargo: 3, Nombre_cargo: 'Dueño' },
  });

  await prisma.estado_usuarios.upsert({
    where: { Id_estado_usuario: 1 },
    update: {},
    create: { Id_estado_usuario: 1, Nombre_estado_usuario: 'Activo' },
  });
  await prisma.estado_usuarios.upsert({
    where: { Id_estado_usuario: 0 },
    update: {},
    create: { Id_estado_usuario: 0, Nombre_estado_usuario: 'Inactivo' },
  });

  await prisma.estado_medios_pago.upsert({
    where: { Id_estado_medio_pago: 1 },
    update: {},
    create: { Id_estado_medio_pago: 1, Nombre_estado_medio_pago: 'Activo' },
  });
  await prisma.estado_medios_pago.upsert({
    where: { Id_estado_medio_pago: 0 },
    update: {},
    create: { Id_estado_medio_pago: 0, Nombre_estado_medio_pago: 'Inactivo' },
  });

  const mediosPago = [
    { id: 1, name: 'Efectivo' },
    { id: 2, name: 'Debito' },
    { id: 3, name: 'Credito' },
    { id: 4, name: 'Transferencia' },
  ];
  for (const mp of mediosPago) {
    await prisma.medio_pagos.upsert({
      where: { Id_pago: mp.id },
      update: {},
      create: { Id_pago: mp.id, Nombre_pago: mp.name, Id_estado_medio_pago: 1 },
    });
  }

  const estadosVenta = ['Pagada', 'Cancelada', 'Devuelta', 'Parcialmente pagada'];
  for (let i = 0; i < estadosVenta.length; i++) {
    await prisma.estado_ventas.upsert({
      where: { Id_estado_venta: i + 1 },
      update: {},
      create: { Id_estado_venta: i + 1, Nombre_estado_venta: estadosVenta[i] },
    });
  }

  // 2. Initial Administrator from Environment Variables
  const rut = parseInt(process.env.INIT_ADMIN_RUT) || 11111111;
  const nombre = process.env.INIT_ADMIN_NAME || 'Admin';
  const apellido1 = process.env.INIT_ADMIN_LASTNAME || 'Prueba';
  const password = process.env.INIT_ADMIN_PASSWORD || '$argon2i$v=19$m=16,t=2,p=1$b2xCSFgxVzF1SnhZUGJySg$HYmqPvP8tXr0XqSptyFTrA';

  console.log(`Creating/Updating initial admin: ${nombre} (${rut})...`);
  await prisma.usuarios.upsert({
    where: { Id_usuario: rut },
    update: {
      Nombre: nombre,
      Apellido_1: apellido1,
      Contrasena: password,
      Cargo: 1,
      Id_estado_usuario: 1
    },
    create: {
      Id_usuario: rut,
      Nombre: nombre,
      Apellido_1: apellido1,
      Apellido_2: 'Administrador',
      Contrasena: password,
      Cargo: 1,
      Id_estado_usuario: 1
    },
  });

  // 3. Los Triggers ya no se aplican por Prisma. 
  // Ahora el Provisioner los aplica usando el cliente nativo de MySQL con el archivo 02-triggers.sql.

  console.log('--- Seeding Process Completed ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
