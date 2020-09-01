import { createPrismaTestClient } from "./createPrismaTestClient";

export const deleteService = async (id: string) => {
  const prisma = createPrismaTestClient();
  try {
    return !!(await prisma.service.delete({
      where: { id }
    }));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteClient = async (id: string) => {
  const prisma = createPrismaTestClient();
  try {
    return !!(await prisma.client.delete({
      where: { id }
    }));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteProgram = async (id: string) => {
  const prisma = createPrismaTestClient();
  try {
    return !!(await prisma.program.delete({
      where: { id }
    }));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};

export const deleteCategory = async (id: string) => {
  const prisma = createPrismaTestClient();
  try {
    return !!(await prisma.category.delete({
      where: { id }
    }));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};
