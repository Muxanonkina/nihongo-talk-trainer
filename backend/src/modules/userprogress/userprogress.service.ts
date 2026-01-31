import db from "@/config/db";

export const findAllByUserId = async (userId: string) => {
  const progresses = await db.userProgress.findMany({
    where: {
      userId,
    },
    include: {
      dialog: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return progresses.map(p => ({
    ...p,
    messages: p.messages ? JSON.parse(p.messages as unknown as string) : null
  }));
};

export const findById = async (id: string, userId: string) => {
  const progress = await db.userProgress.findFirst({
    where: {
      id,
      userId,
    },
    include: {
      dialog: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!progress) return null;

  return {
    ...progress,
    messages: progress.messages ? JSON.parse(progress.messages as unknown as string) : null
  };
};

export const create = async (data: {
  userId: string;
  dialogId: string;
  score: number;
  feedback?: string;
  messages?: any;
}) => {
  const { messages, ...rest } = data;
  // cast as any to bypass prisma type mismatch during migration
  const progress = await db.userProgress.create({
    data: {
      ...rest,
      messages: messages ? JSON.stringify(messages) : undefined
    } as any,
  });

  return {
    ...progress,
    messages: progress.messages ? JSON.parse(progress.messages as unknown as string) : null
  };
};
