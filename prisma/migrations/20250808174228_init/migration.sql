-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "call_sheets" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "shootDate" DATETIME NOT NULL,
    "callTime" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "mapLink" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "projectType" TEXT,
    "weather" TEXT,
    "sunrise" TEXT,
    "sunset" TEXT,
    "generalNotes" TEXT,
    "safetyNotes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "call_sheets_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scenes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sceneNumber" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "timeOfDay" TEXT,
    "pages" REAL,
    "estimatedTime" TEXT,
    "notes" TEXT,
    "callSheetId" TEXT NOT NULL,
    CONSTRAINT "scenes_callSheetId_fkey" FOREIGN KEY ("callSheetId") REFERENCES "call_sheets" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "crew_members" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "department" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "union" TEXT,
    "rate" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "crew_members_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "call_sheet_crew" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "callTime" TEXT,
    "wrapTime" TEXT,
    "notes" TEXT,
    "callSheetId" TEXT NOT NULL,
    "crewMemberId" TEXT NOT NULL,
    CONSTRAINT "call_sheet_crew_callSheetId_fkey" FOREIGN KEY ("callSheetId") REFERENCES "call_sheets" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "call_sheet_crew_crewMemberId_fkey" FOREIGN KEY ("crewMemberId") REFERENCES "crew_members" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "data" JSONB NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdById" TEXT NOT NULL,
    CONSTRAINT "templates_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "call_sheet_crew_callSheetId_crewMemberId_key" ON "call_sheet_crew"("callSheetId", "crewMemberId");
