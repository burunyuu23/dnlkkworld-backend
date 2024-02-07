/*
  Warnings:

  - Added the required column `first_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user"."User" ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "second_name" TEXT;
