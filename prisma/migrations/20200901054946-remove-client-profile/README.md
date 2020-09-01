# Migration `20200901054946-remove-client-profile`

This migration has been generated at 9/1/2020, 3:49:46 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`Client` DROP FOREIGN KEY `Client_ibfk_2`

ALTER TABLE `cms`.`Client` DROP COLUMN `clientProfileId`,
ADD COLUMN `firstName` varchar(191) NOT NULL ,
ADD COLUMN `lastName` varchar(191)  ,
ADD COLUMN `email` varchar(191)  ,
ADD COLUMN `phone` varchar(191)  ,
ADD COLUMN `address` varchar(191)  ;

DROP TABLE `cms`.`ClientProfile`;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200822104724-remove-user-profile..20200901054946-remove-client-profile
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
@@ -83,33 +83,23 @@
   programs  Program[]
 }
 model Client {
-  id              String            @id
-  notes           String?
-  createdAt       DateTime          @default(now())
-  updatedAt       DateTime          @default(now())
-  //
-  user            User?             @relation(fields: [userId], references: [id])
-  userId          String?
-  profile         ClientProfile     @relation(fields: [clientProfileId], references: [id])
-  clientProfileId String
-  //
-  events          CalendarEvent[]
-  services        ServiceToClient[]
-}
-
-model ClientProfile {
-  id        String   @id
+  id        String            @id
   firstName String
   lastName  String?
   email     String?
   phone     String?
   address   String?
-  createdAt DateTime @default(now())
-  updatedAt DateTime @default(now())
+  notes     String?
+  createdAt DateTime          @default(now())
+  updatedAt DateTime          @default(now())
   //
-  client    Client[]
+  user      User?             @relation(fields: [userId], references: [id])
+  userId    String?
+  //
+  events    CalendarEvent[]
+  services  ServiceToClient[]
 }
 model ServiceToClient {
   quantity  Int
```


