import { ApiError, apiHandler, checkAuth, errorMessages } from "@/libs/api-utils";
import { prisma } from "@/libs/prisma";
import { NextRequest } from "next/server";

// Define the correct params type for Next.js route handlers
type Params = Promise<{ id: string }>

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  return apiHandler(async () => {
    const session = await checkAuth();
    const userId = (await params).id;
    // console.log("🚀 ~ context:", await params)

    // if (!session) throw new ApiError(403, errorMessages.forbidden);
    // if (!userId) {
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  return apiHandler(async () => {
    const session = await checkAuth();
    const userId = (await params).id;

    if (session.user.role !== "admin" && session.user.id !== userId) {
      throw new ApiError(403, errorMessages.forbidden);
    }

    const { name, email, image } = await request.json();
    const updateData: Partial<{
      name: string;
      image: string;

    }> = {
      ...(name && { name }),
      ...(email && { email }),
      ...(image && { image }),
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  return apiHandler(async () => {
    const session = await checkAuth('admin');
    const userId = (await params).id;

    if (session.user.id === userId) {
      throw new ApiError(400, 'ไม่สามารถลบบัญชีของตัวเองได้');
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    return { success: true, message: 'ลบผู้ใช้เรียบร้อย' };
  });
}