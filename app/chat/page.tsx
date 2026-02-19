import { ChatClient } from "@/app/chat/chat-client";
import { requirePageAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function ChatPage() {
  await requirePageAuth("/chat");
  const messages: Array<{
    id: number;
    text: string;
    displayName: string | null;
    createdAt: Date;
  }> = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <ChatClient
      initialMessages={messages.map((message) => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
      }))}
    />
  );
}
