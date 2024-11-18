CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "artists" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "grammy" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "albums" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "artistId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "tracks" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "artistId" UUID,
    "albumId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "favorites" (
    "id" UUID NOT NULL,
    "artistId" UUID,
    "albumId" UUID,
    "trackId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "favorites_artistId_key" ON "favorites"("artistId");

CREATE UNIQUE INDEX "favorites_albumId_key" ON "favorites"("albumId");

CREATE UNIQUE INDEX "favorites_trackId_key" ON "favorites"("trackId");

ALTER TABLE "albums" ADD CONSTRAINT "albums_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tracks" ADD CONSTRAINT "tracks_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "tracks" ADD CONSTRAINT "tracks_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "favorites" ADD CONSTRAINT "favorites_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "favorites" ADD CONSTRAINT "favorites_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "favorites" ADD CONSTRAINT "favorites_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
