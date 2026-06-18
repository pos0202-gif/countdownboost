-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CountdownSettings" (
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
    "countdownType" TEXT NOT NULL DEFAULT 'fixed',
    "evergreenMinutes" INTEGER NOT NULL DEFAULT 30,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_CountdownSettings" ("backgroundColor", "buttonLink", "buttonText", "createdAt", "enabled", "endTime", "headline", "id", "message", "shop", "textColor", "updatedAt") SELECT "backgroundColor", "buttonLink", "buttonText", "createdAt", "enabled", "endTime", "headline", "id", "message", "shop", "textColor", "updatedAt" FROM "CountdownSettings";
DROP TABLE "CountdownSettings";
ALTER TABLE "new_CountdownSettings" RENAME TO "CountdownSettings";
CREATE UNIQUE INDEX "CountdownSettings_shop_key" ON "CountdownSettings"("shop");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
