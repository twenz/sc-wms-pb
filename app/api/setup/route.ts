import { prisma } from '@/libs/prisma';
import { UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // ตรวจสอบว่ามีผู้ใช้ในระบบแล้วหรือไม่
    const userCount = await prisma.user.count();

    // ถ้ามีผู้ใช้ในระบบแล้ว จะไม่อนุญาตให้สร้างผู้ใช้เริ่มต้น
    if (userCount > 0) {
      return NextResponse.json(
        { error: 'ระบบมีผู้ใช้อยู่แล้ว ไม่สามารถตั้งค่าเริ่มต้นได้' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, email, password, phone } = body;
    console.log({ name, email, password })
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' },
        { status: 400 }
      );
    }
    // ตรวจสอบว่าอีเมลมีอยู่ในระบบแล้วหรือไม่
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: 'อีเมลนี้มีผู้ใช้อยู่แล้ว' },
        { status: 400 }
      );
    }
    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, process.env.NEXT_SALT);
    // สร้างผู้ใช้ใหม่
    // ตั้งค่า role เป็น admin
    const role = await prisma.role.findUnique({
      where: { name: UserRole.ADMIN },
    });
    if (!role) {
      return NextResponse.json(
        { error: 'ไม่พบ admin ในระบบ' },
        { status: 500 }
      );
    }
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: {
          connect: {
            id: role.id
          }
        },
        phone: phone, // Add required phone field with empty string
      },
    });
    return NextResponse.json(
      { message: 'ตั้งค่าเริ่มต้นสำเร็จ', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in setup route:', error);
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการตั้งค่าเริ่มต้น' },
      { status: 500 }
    );
  }
}