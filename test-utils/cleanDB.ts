import { getPrismaTestClient } from "./getPrismaTestClient";

export const deleteService = async (id: string) => {
  const prisma = getPrismaTestClient();
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
