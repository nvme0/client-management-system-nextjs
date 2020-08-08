# Migration `20200806183349-update-hello`

This migration has been generated at 8/7/2020, 4:33:49 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`Hello` ADD COLUMN `message` varchar(191) NOT NULL DEFAULT '';
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200806174528-create-hello..20200806183349-update-hello
--- datamodel.dml
+++ datamodel.dml
@@ -2,16 +2,17 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "mysql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
 }
 model Hello {
   id        String   @id @default(uuid())
+  message   String   @default("")
   createdAt DateTime @default(now())
   updatedAt DateTime @updatedAt
 }
```


