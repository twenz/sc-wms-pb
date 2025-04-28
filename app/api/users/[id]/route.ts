import { ApiError, apiHandler, checkAuth, errorMessages } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { NextRequest } from "next/server";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  return apiHandler(async () => {
    const session = await checkAuth();
    const userId = params.id;

    if (session.user.role !== "admin" && session.user.id !== userId) {
      throw new ApiError(403, errorMessages.forbidden);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        image: true,
      },
    });

    if (!user) {
      throw new ApiError(404, errorMessages.notFound);
    }

    return user;
  });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return apiHandler(async () => {
    const session = await checkAuth();
    const userId = params.id;

    if (session.user.role !== "admin" && session.user.id !== userId) {
      throw new ApiError(403, errorMessages.forbidden);
    }

    const { name, email, password, role, image } = await request.json();
    const updateData: Partial<{
      name: string;
      email: string;
      image: string;
      password: string;
      role: string;
    }> = {
      ...(name && { name }),
      ...(email && { email }),
      ...(image && { image }),
      ...(password && { password: await hash(password, 12) }),
      ...(session.user.role === "admin" && role && { role })
    };

    return await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        image: true,
      },
    });
  });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  return apiHandler(async () => {
    const session = await checkAuth('admin');
    const userId = params.id;

    if (session.user.id === userId) {
      throw new ApiError(400, 'ไม่สามารถลบบัญชีของตัวเองได้');
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true, message: 'ลบผู้ใช้เรียบร้อย' };
  });
}