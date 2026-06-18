-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,
    "refreshToken" TEXT,
    "refreshTokenExpires" TIMESTAMP(3),

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CountdownSettings" (
    "id" SERIAL NOT NULL,
    "shop" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "headline" TEXT NOT NULL DEFAULT 'Limited Time Offer',
    "message" TEXT NOT NULL DEFAULT 'Get 10% off before the timer ends.',
    "endTime" TEXT NOT NULL DEFAULT '',
    "backgroundColor" TEXT NOT NULL DEFAULT '#111111',
    "textColor" TEXT NOT NULL DEFAULT '#ffffff',
    "buttonText" TEXT NOT NULL DEFAULT 'Shop now',
    "buttonLink" TEXT NOT NULL DEFAULT '/collections/all',
    "countdownType" TEXT NOT NULL DEFAULT 'fixed',
    "evergreenMinutes" INTEGER NOT NULL DEFAULT 30,
    "bannerPosition" TEXT NOT NULL DEFAULT 'inline',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountdownSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CountdownSettings_shop_key" ON "CountdownSettings"("shop");
