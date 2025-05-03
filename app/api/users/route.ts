import { ApiError, apiHandler, checkAuth, errorMessages } from "@/libs/api-utils";
import { prisma } from "@/libs/prisma";
import { UserRole } from "@prisma/client";

export async function GET() {
  return apiHandler(async () => {
    const sesion = await checkAuth();
    if (sesion?.user.role != UserRole.ADMIN) {
      throw new ApiError(403, errorMessages.forbidden);
    }
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return users;
  });
}