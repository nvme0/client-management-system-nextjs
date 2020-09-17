# Migration `20200916114403-remove-categories`

This migration has been generated at 9/16/2020, 9:44:04 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`Category` DROP FOREIGN KEY `Category_ibfk_1`

ALTER TABLE `cms`.`_CategoryToProgram` DROP FOREIGN KEY `_CategoryToProgram_ibfk_1`

ALTER TABLE `cms`.`_CategoryToProgram` DROP FOREIGN KEY `_CategoryToProgram_ibfk_2`

DROP TABLE `cms`.`Category`

DROP TABLE `cms`.`_CategoryToProgram`
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200914020233-add-programs-to-clients..20200916114403-remove-categories
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
@@ -21,9 +21,8 @@
   services  Service[]
   programs  Program[]
   clients   Client[]
   events    CalendarEvent[]
-  Category  Category[]
 }
 model CalendarEvent {
   id        String   @id
@@ -60,34 +59,19 @@
   programs  ServiceToProgram[]
 }
 model Program {
-  id         String             @id
-  name       String
-  notes      String?
-  createdAt  DateTime           @default(now())
-  updatedAt  DateTime           @default(now())
-  //
-  user       User?              @relation(fields: [userId], references: [id])
-  userId     String?
-  //
-  services   ServiceToProgram[]
-  categories Category[]
-  clients    ProgramToClient[]
-}
-
-model Category {
-  id        String    @id
+  id        String             @id
   name      String
-  for       String
   notes     String?
-  createdAt DateTime  @default(now())
-  updatedAt DateTime  @default(now())
+  createdAt DateTime           @default(now())
+  updatedAt DateTime           @default(now())
   //
-  user      User?     @relation(fields: [userId], references: [id])
+  user      User?              @relation(fields: [userId], references: [id])
   userId    String?
   //
-  programs  Program[]
+  services  ServiceToProgram[]
+  clients   ProgramToClient[]
 }
 model Client {
   id        String            @id
```


