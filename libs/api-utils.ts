import { Prisma } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorMessages = {
  notFound: 'ไม่พบข้อมูล',
  unauthorized: 'กรุณาเข้าสู่ระบบ',
  forbidden: 'ไม่มีสิทธิ์เข้าถึง',
  duplicate: 'ข้อมูลซ้ำในระบบ',
  invalidData: 'ข้อมูลไม่ถูกต้อง',
  serverError: 'เกิดข้อผิดพลาดในการดำเนินการ'
} as const;

export const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError) => {
  const errorMap: Record<string, { status: number; message: string }> = {
    P2025: { status: 404, message: errorMessages.notFound },
    P2002: { status: 400, message: errorMessages.duplicate },
    P2003: { status: 400, message: errorMessages.invalidData }
  };

  const errorInfo = errorMap[error.code] ||
    { status: 500, message: errorMessages.serverError };

  throw new ApiError(errorInfo.status, errorInfo.message);
};

export const apiHandler = async <T>(handler: () => Promise<T>) => {
  try {
    const result = await handler();
    return NextResponse.json(result);
  } catch (error) {

    if (error instanceof ApiError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      try {
        handlePrismaError(error);
      } catch (e) {
        if (e instanceof ApiError) {
          return NextResponse.json(
            { error: e.message },
            { status: e.statusCode }
          );
        }
      }
    }

    return NextResponse.json(
      { error: errorMessages.serverError },
      { status: 500 }
    );
  }
};

export const checkAuth = async (requiredRole?: string) => {
  const session = await getServerSession();
  if (!session) {
    throw new ApiError(401, errorMessages.unauthorized);
  }
  if (requiredRole && session.user.role !== requiredRole) {
    throw new ApiError(403, errorMessages.forbidden);
  }
  return session;
};
