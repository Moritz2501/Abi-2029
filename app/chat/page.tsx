import { ChatClient } from "@/app/chat/chat-client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ChatPage() {
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
