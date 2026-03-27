import { PrismaClient } from '@/generated/prisma'; // si usaste output en schema.prisma
const prisma = new PrismaClient();
export default prisma;
