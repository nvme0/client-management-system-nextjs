# Migration `20200822104724-remove-user-profile`

This migration has been generated at 8/22/2020, 8:47:24 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`User` DROP FOREIGN KEY `User_ibfk_1`

ALTER TABLE `cms`.`User` DROP COLUMN `userProfileId`;

DROP TABLE `cms`.`UserProfile`;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200815043753-make-service-expires-a-date-time-value..20200822104724-remove-user-profile
--- datamodel.dml
+++ datamodel.dml
@@ -2,42 +2,29 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
 datasource db {
   provider = "mysql"
-  url = "***"
+  url = "***"
 }
 generator client {
   provider = "prisma-client-js"
 }
 model User {
-  id            String          @id @default(uuid())
-  email         String          @unique
-  password      String
-  confirmed     Boolean         @default(true)
-  createdAt     DateTime        @default(now())
-  updatedAt     DateTime        @default(now())
+  id        String          @id
+  email     String          @unique
+  password  String
+  confirmed Boolean         @default(true)
+  createdAt DateTime        @default(now())
+  updatedAt DateTime        @default(now())
   //
-  profile       UserProfile     @relation(fields: [userProfileId], references: [id])
-  userProfileId String
-  //
-  services      Service[]
-  programs      Program[]
-  clients       Client[]
-  events        CalendarEvent[]
+  services  Service[]
+  programs  Program[]
+  clients   Client[]
+  events    CalendarEvent[]
 }
-model UserProfile {
-  id        String   @id
-  firstName String?
-  lastName  String?
-  createdAt DateTime @default(now())
-  updatedAt DateTime @default(now())
-  //
-  user      User[]
-}
-
 model CalendarEvent {
   id        String   @id
   title     String
   start     DateTime
```


