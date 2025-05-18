import { ApiError, apiHandler, checkAuth } from "@/libs/api-utils";
import { prisma } from "@/libs/prisma";
import { Event } from "@prisma/client";

export async function GET() {
  return apiHandler(async () => {
    await checkAuth();
    const events: Event[] = await prisma.event.findMany();
    return events;
  });
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    await checkAuth();
    const body = await request.json();
    const { title, description, start, end } = body;
    if (!title || !start || !end) {
      throw new ApiError(400, "Missing required fields");
    }
    const newEvent = await prisma.event.create({
      data: {
        title,
        description,
        start: new Date(start),
        end: new Date(end),
      },
    });
    return newEvent
  });
}