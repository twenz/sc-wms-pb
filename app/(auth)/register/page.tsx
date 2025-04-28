'use client';

import Register from "@/app/components/Register";
import { UserRole } from "@prisma/client";

export default function Page() {

  return (
    <Register type={UserRole.USER} />
  )
}