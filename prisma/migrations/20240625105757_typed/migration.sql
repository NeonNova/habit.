/*
  Warnings:

  - You are about to drop the column `target` on the `Habit` table. All the data in the column will be lost.
  - You are about to drop the column `unit` on the `Habit` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Habit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "timesPerDay" INTEGER,
    "timeGoal" INTEGER,
    "missesAllowed" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Habit" ("createdAt", "id", "isActive", "name", "type") SELECT "createdAt", "id", "isActive", "name", "type" FROM "Habit";
DROP TABLE "Habit";
ALTER TABLE "new_Habit" RENAME TO "Habit";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
