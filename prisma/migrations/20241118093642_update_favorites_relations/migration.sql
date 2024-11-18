/*
  Warnings:

  - You are about to drop the column `albumId` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `artistId` on the `favorites` table. All the data in the column will be lost.
  - You are about to drop the column `trackId` on the `favorites` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `favorites` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_albumId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_artistId_fkey";

-- DropForeignKey
ALTER TABLE "favorites" DROP CONSTRAINT "favorites_trackId_fkey";

-- DropIndex
DROP INDEX "favorites_albumId_key";

-- DropIndex
DROP INDEX "favorites_artistId_key";

-- DropIndex
DROP INDEX "favorites_trackId_key";

-- AlterTable
ALTER TABLE "favorites" DROP COLUMN "albumId",
DROP COLUMN "artistId",
DROP COLUMN "trackId",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "_ArtistToFavorites" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_AlbumToFavorites" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateTable
CREATE TABLE "_TrackToFavorites" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArtistToFavorites_AB_unique" ON "_ArtistToFavorites"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtistToFavorites_B_index" ON "_ArtistToFavorites"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AlbumToFavorites_AB_unique" ON "_AlbumToFavorites"("A", "B");

-- CreateIndex
CREATE INDEX "_AlbumToFavorites_B_index" ON "_AlbumToFavorites"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TrackToFavorites_AB_unique" ON "_TrackToFavorites"("A", "B");

-- CreateIndex
CREATE INDEX "_TrackToFavorites_B_index" ON "_TrackToFavorites"("B");

-- AddForeignKey
ALTER TABLE "_ArtistToFavorites" ADD CONSTRAINT "_ArtistToFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToFavorites" ADD CONSTRAINT "_ArtistToFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumToFavorites" ADD CONSTRAINT "_AlbumToFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumToFavorites" ADD CONSTRAINT "_AlbumToFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrackToFavorites" ADD CONSTRAINT "_TrackToFavorites_A_fkey" FOREIGN KEY ("A") REFERENCES "favorites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TrackToFavorites" ADD CONSTRAINT "_TrackToFavorites_B_fkey" FOREIGN KEY ("B") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
