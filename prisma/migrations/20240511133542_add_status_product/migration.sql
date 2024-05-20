-- CreateTable
CREATE TABLE "ProductStatus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "productId" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'forsale',
    CONSTRAINT "ProductStatus_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
