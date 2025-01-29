/*
  Warnings:

  - You are about to drop the column `messages` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `participant1` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `participant2` on the `Chat` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "messages",
DROP COLUMN "participant1",
DROP COLUMN "participant2",
ADD COLUMN     "groupName" TEXT,
ADD COLUMN     "isGroup" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "ChatUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ChatToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatUser_userId_chatId_key" ON "ChatUser"("userId", "chatId");

-- CreateIndex
CREATE INDEX "_ChatToUser_B_index" ON "_ChatToUser"("B");

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatUser" ADD CONSTRAINT "ChatUser_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser" ADD CONSTRAINT "_ChatToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser" ADD CONSTRAINT "_ChatToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
