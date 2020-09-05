# Migration `20200901084701-add-user-to-category`

This migration has been generated at 9/1/2020, 6:47:01 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`Category` ADD COLUMN `userId` varchar(191)  ;

ALTER TABLE `cms`.`Category` ADD FOREIGN KEY (`userId`) REFERENCES `cms`.`User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200901054946-remove-client-profile..20200901084701-add-user-to-category
--- datamodel.dml
+++ datamodel.dml
@@ -2,9 +2,9 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "mysql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
@@ -21,8 +21,9 @@
   services  Service[]
   programs  Program[]
   clients   Client[]
   events    CalendarEvent[]
+  Category  Category[]
 }
 model CalendarEvent {
   id        String   @id
@@ -79,8 +80,11 @@
   notes     String?
   createdAt DateTime  @default(now())
   updatedAt DateTime  @default(now())
   //
+  user      User?     @relation(fields: [userId], references: [id])
+  userId    String?
+  //
   programs  Program[]
 }
 model Client {
```


