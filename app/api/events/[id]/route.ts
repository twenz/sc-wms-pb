import { ApiError, apiHandler, checkAuth } from "@/libs/api-utils";
import { prisma } from "@/libs/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return apiHandler(async () => {
    await checkAuth();
    const eventId = (await params).id;
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new ApiError(404, "Event not found");
    return event;
  });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return apiHandler(async () => {
    await checkAuth();
    const body = await request.json();
    const eventId = (await params).id;
    const { title, description, start, end } = body;
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        description,
        start: new Date(start),
        end: new Date(end),
      },
    });
    return updatedEvent;
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return apiHandler(async () => {
    await checkAuth();
    await prisma.event.delete({
      where: { id: params.id },
    });
    return { message: "Event deleted successfully" };
  });
}