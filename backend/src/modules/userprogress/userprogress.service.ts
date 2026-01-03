import db from "@/config/db";

export const findAllByUserId = (userId: string) => {
  return db.userProgress.findMany({
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
};

export const findById = (id: string, userId: string) => {
  return db.userProgress.findFirst({
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
};
