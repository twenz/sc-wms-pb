import { ApiError, apiHandler, errorMessages } from "@/libs/api-utils";
import { prisma } from "@/libs/prisma";
import { UserRole } from "@prisma/client";
import { hash } from "bcrypt";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  return apiHandler(async () => {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') as UserRole | null;

    const users = await prisma.user.findMany({
      where: role ? { role } : undefined,
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

export async function POST(request: NextRequest) {
  return apiHandler(async () => {
    const data = await request.json();

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new ApiError(400, errorMessages.duplicate);
    }

    const hashedPassword = await hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    return user;
  });
}