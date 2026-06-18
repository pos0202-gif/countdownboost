-- CreateTable
CREATE TABLE "CountdownSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "headline" TEXT NOT NULL DEFAULT 'Limited Time Offer',
    "message" TEXT NOT NULL DEFAULT 'Get 10% off before the timer ends.',
    "endTime" TEXT NOT NULL DEFAULT '',
    "backgroundColor" TEXT NOT NULL DEFAULT '#111111',
    "textColor" TEXT NOT NULL DEFAULT '#ffffff',
    "buttonText" TEXT NOT NULL DEFAULT 'Shop now',
    "buttonLink" TEXT NOT NULL DEFAULT '/collections/all',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CountdownSettings_shop_key" ON "CountdownSettings"("shop");
