import { unauthorizedResponse, verifyAdminRequest } from "@/lib/admin-auth";
import { deleteMessage } from "@/lib/server/messages";

type RouteContext = {
  params: Promise<{ roomId: string; messageId: string }>;
};

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await verifyAdminRequest(request))) {
    return unauthorizedResponse();
  }

  const { roomId, messageId } = await context.params;

  if (!roomId || !messageId) {
    return Response.json(
      { error: "Room ID and message ID are required." },
      { status: 400 },
    );
  }

  try {
    await deleteMessage(roomId, messageId);
    return Response.json({ ok: true });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "Message not found.") {
      return Response.json({ error: error.message }, { status: 404 });
    }

    return Response.json(
      { error: "Failed to delete message." },
      { status: 500 },
    );
  }
}
