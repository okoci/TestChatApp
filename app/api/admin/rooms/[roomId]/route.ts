import { unauthorizedResponse, verifyAdminRequest } from "@/lib/admin-auth";
import { deleteRoom } from "@/lib/server/rooms";

type RouteContext = {
  params: Promise<{ roomId: string }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await verifyAdminRequest(request))) {
    return unauthorizedResponse();
  }

  const { roomId } = await context.params;

  if (!roomId) {
    return Response.json({ error: "Room ID is required." }, { status: 400 });
  }

  try {
    await deleteRoom(roomId);
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "Room not found.") {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json(
      { error: "Failed to delete room." },
      { status: 500 },
    );
  }
}
