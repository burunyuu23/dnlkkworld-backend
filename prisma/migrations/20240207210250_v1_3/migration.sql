/*
  Warnings:

  - A unique constraint covering the columns `[banner_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[avatar_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user"."User" ADD COLUMN     "avatar_id" INTEGER,
ADD COLUMN     "banner_id" INTEGER;

-- CreateTable
CREATE TABLE "social"."_likes" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "social"."_likedComments" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "social"."_likedPosts" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_likes_AB_unique" ON "social"."_likes"("A", "B");

-- CreateIndex
CREATE INDEX "_likes_B_index" ON "social"."_likes"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_likedComments_AB_unique" ON "social"."_likedComments"("A", "B");

-- CreateIndex
CREATE INDEX "_likedComments_B_index" ON "social"."_likedComments"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_likedPosts_AB_unique" ON "social"."_likedPosts"("A", "B");

-- CreateIndex
CREATE INDEX "_likedPosts_B_index" ON "social"."_likedPosts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "User_banner_id_key" ON "user"."User"("banner_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_avatar_id_key" ON "user"."User"("avatar_id");

-- AddForeignKey
ALTER TABLE "user"."User" ADD CONSTRAINT "User_banner_id_fkey" FOREIGN KEY ("banner_id") REFERENCES "social"."Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."User" ADD CONSTRAINT "User_avatar_id_fkey" FOREIGN KEY ("avatar_id") REFERENCES "social"."Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."_likes" ADD CONSTRAINT "_likes_A_fkey" FOREIGN KEY ("A") REFERENCES "social"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."_likes" ADD CONSTRAINT "_likes_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."_likedComments" ADD CONSTRAINT "_likedComments_A_fkey" FOREIGN KEY ("A") REFERENCES "social"."Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."_likedComments" ADD CONSTRAINT "_likedComments_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."_likedPosts" ADD CONSTRAINT "_likedPosts_A_fkey" FOREIGN KEY ("A") REFERENCES "social"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."_likedPosts" ADD CONSTRAINT "_likedPosts_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
