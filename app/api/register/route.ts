import { ApiError, apiHandler, errorMessages } from "@/libs/api-utils";
import { prisma } from "@/libs/prisma";
import { Prisma, UserRole } from "@prisma/client";
import { genSalt, hash, } from "bcrypt";
import { NextRequest } from "next/server";

const secret = process.env.NEXT_SALT

export async function POST(request: NextRequest) {
  return apiHandler(async () => {
    const data: Prisma.UserCreateInput & { roleId?: string } = await request.json();

    // Check for existing email
    const existingEmail = data.email ? await prisma.user.findUnique({
      where: { email: data.email }
    }) : false

    // Check for existing phone
    const existingPhone = await prisma.user.findUnique({
      where: { phone: data.phone }
    });

    // Build duplicate field message
    const duplicateFields = [
      existingEmail && 'email',
      existingPhone && 'phone'
    ].filter(Boolean);

    if (duplicateFields.length > 0) {
      const duplicateMessage = duplicateFields.join(', ');
      throw new ApiError(400, `${errorMessages.duplicate} ${duplicateMessage}`);
    }

    const salt = await genSalt(parseInt(secret as string))
    const hashedPassword = await hash(data.password, salt);

    const role = await prisma.role.findFirst({
      where: {
        OR: [
          data.roleId ? { id: data.roleId } : {},
          { name: UserRole.USER }
        ]
      }
    })

    const userData: Prisma.UserCreateInput = data
    const user = await prisma.user.create({
      data: {
        ...userData,
        role: {
          connect: {
            name: role?.name
          }
        },
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      },
    });

    return user;
  });
}