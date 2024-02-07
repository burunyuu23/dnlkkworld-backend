-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "chat";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "questionnaire";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "social";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "user";

-- CreateEnum
CREATE TYPE "user"."Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "user"."MaritalStatus" AS ENUM ('married', 'divorced', 'was_not_married');

-- CreateEnum
CREATE TYPE "user"."RelationshipStatus" AS ENUM ('sent_by_first', 'sent_by_second', 'friends', 'blocked_by_first', 'blocked_by_second', 'blocked_both');

-- CreateTable
CREATE TABLE "user"."Country" (
    "id" UUID NOT NULL,
    "short_value" VARCHAR(2) NOT NULL,
    "value" VARCHAR(64) NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."User" (
    "id" UUID NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "age" INTEGER,
    "image_url" TEXT,
    "gender_t" "user"."Gender",
    "marital_status_t" "user"."MaritalStatus",
    "country" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user"."Relationship" (
    "id" SERIAL NOT NULL,
    "status" "user"."RelationshipStatus" NOT NULL,
    "userId1" UUID NOT NULL,
    "userId2" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Relationship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire"."Questionnaire" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "multiple" BOOLEAN DEFAULT false,
    "answeredCount" INTEGER DEFAULT 0,
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire"."Option" (
    "id" UUID NOT NULL,
    "text" TEXT NOT NULL,
    "questionnaire_id" INTEGER NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire"."Choice" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "option_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Choice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."Message" (
    "id" SERIAL NOT NULL,
    "to_id" UUID NOT NULL,
    "from_id" UUID NOT NULL,
    "roomId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "send_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "watched" BOOLEAN NOT NULL,
    "voice_message_url" TEXT,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat"."Room" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social"."Media" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social"."Comment" (
    "id" SERIAL NOT NULL,
    "media_id" INTEGER,
    "author_id" UUID NOT NULL,
    "post_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social"."Post" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "author_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questionnaire"."_answered" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "chat"."_RoomToUser" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "social"."_MediaToMessage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "social"."_MediaToPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_answered_AB_unique" ON "questionnaire"."_answered"("A", "B");

-- CreateIndex
CREATE INDEX "_answered_B_index" ON "questionnaire"."_answered"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_RoomToUser_AB_unique" ON "chat"."_RoomToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_RoomToUser_B_index" ON "chat"."_RoomToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MediaToMessage_AB_unique" ON "social"."_MediaToMessage"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaToMessage_B_index" ON "social"."_MediaToMessage"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MediaToPost_AB_unique" ON "social"."_MediaToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_MediaToPost_B_index" ON "social"."_MediaToPost"("B");

-- AddForeignKey
ALTER TABLE "user"."User" ADD CONSTRAINT "User_country_fkey" FOREIGN KEY ("country") REFERENCES "user"."Country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."Relationship" ADD CONSTRAINT "Relationship_userId1_fkey" FOREIGN KEY ("userId1") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user"."Relationship" ADD CONSTRAINT "Relationship_userId2_fkey" FOREIGN KEY ("userId2") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire"."Questionnaire" ADD CONSTRAINT "Questionnaire_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire"."Option" ADD CONSTRAINT "Option_questionnaire_id_fkey" FOREIGN KEY ("questionnaire_id") REFERENCES "questionnaire"."Questionnaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire"."Choice" ADD CONSTRAINT "Choice_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire"."Choice" ADD CONSTRAINT "Choice_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "questionnaire"."Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."Message" ADD CONSTRAINT "Message_to_id_fkey" FOREIGN KEY ("to_id") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."Message" ADD CONSTRAINT "Message_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "chat"."Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."Media" ADD CONSTRAINT "Media_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."Comment" ADD CONSTRAINT "Comment_media_id_fkey" FOREIGN KEY ("media_id") REFERENCES "social"."Media"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."Comment" ADD CONSTRAINT "Comment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."Comment" ADD CONSTRAINT "Comment_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "social"."Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."Post" ADD CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "user"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire"."_answered" ADD CONSTRAINT "_answered_A_fkey" FOREIGN KEY ("A") REFERENCES "questionnaire"."Questionnaire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questionnaire"."_answered" ADD CONSTRAINT "_answered_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."_RoomToUser" ADD CONSTRAINT "_RoomToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "chat"."Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat"."_RoomToUser" ADD CONSTRAINT "_RoomToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."_MediaToMessage" ADD CONSTRAINT "_MediaToMessage_A_fkey" FOREIGN KEY ("A") REFERENCES "social"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."_MediaToMessage" ADD CONSTRAINT "_MediaToMessage_B_fkey" FOREIGN KEY ("B") REFERENCES "chat"."Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."_MediaToPost" ADD CONSTRAINT "_MediaToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "social"."Media"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "social"."_MediaToPost" ADD CONSTRAINT "_MediaToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "social"."Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
