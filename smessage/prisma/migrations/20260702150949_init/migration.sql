-- CreateTable
CREATE TABLE "message" (
    "id" SERIAL NOT NULL,
    "msg" TEXT NOT NULL,
    "name" TEXT,
    "repost" BOOLEAN NOT NULL DEFAULT false,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);
