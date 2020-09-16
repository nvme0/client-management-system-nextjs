# Migration `20200916124048-add-service-to-program-to-client--extension-of-service-to-program-for-client---modify-program-to-client--program-for-client`

This migration has been generated at 9/16/2020, 10:40:48 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`ProgramToClient` DROP FOREIGN KEY `ProgramToClient_ibfk_1`

ALTER TABLE `cms`.`ProgramToClient` DROP PRIMARY KEY,
DROP COLUMN `programId`,
ADD COLUMN `id` varchar(191)  NOT NULL ,
ADD COLUMN `name` varchar(191)  NOT NULL ,
ADD COLUMN `notes` varchar(191)  ,
ADD COLUMN `parentProgramId` varchar(191)  NOT NULL ,
ADD PRIMARY KEY (`id`)

CREATE TABLE `cms`.`ServiceToProgramToClient` (
`quantity` int  NOT NULL ,
`booked` int  NOT NULL ,
`used` int  NOT NULL ,
`createdAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`serviceId` varchar(191)  NOT NULL ,
`programId` varchar(191)  NOT NULL ,
PRIMARY KEY (`serviceId`,`programId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `cms`.`ServiceToProgramToClient` ADD FOREIGN KEY (`serviceId`) REFERENCES `cms`.`Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `cms`.`ServiceToProgramToClient` ADD FOREIGN KEY (`programId`) REFERENCES `cms`.`ProgramToClient`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `cms`.`ProgramToClient` ADD FOREIGN KEY (`parentProgramId`) REFERENCES `cms`.`Program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200916114403-remove-categories..20200916124048-add-service-to-program-to-client--extension-of-service-to-program-for-client---modify-program-to-client--program-for-client
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
@@ -42,38 +42,54 @@
   serviceId String?
 }
 model Service {
-  id        String             @id
-  name      String
-  duration  String?
-  expires   DateTime?
-  notes     String?
-  createdAt DateTime           @default(now())
-  updatedAt DateTime           @default(now())
+  id                        String                     @id
+  name                      String
+  duration                  String?
+  expires                   DateTime?
+  notes                     String?
+  createdAt                 DateTime                   @default(now())
+  updatedAt                 DateTime                   @default(now())
   //
-  user      User?              @relation(fields: [userId], references: [id])
-  userId    String?
+  user                      User?                      @relation(fields: [userId], references: [id])
+  userId                    String?
   //
-  events    CalendarEvent[]
-  clients   ServiceToClient[]
-  programs  ServiceToProgram[]
+  events                    CalendarEvent[]
+  clients                   ServiceToClient[]
+  programs                  ServiceToProgram[]
+  serviceToProgramToClients ServiceToProgramToClient[]
 }
 model Program {
-  id        String             @id
-  name      String
-  notes     String?
-  createdAt DateTime           @default(now())
-  updatedAt DateTime           @default(now())
+  id               String             @id
+  name             String
+  notes            String?
+  createdAt        DateTime           @default(now())
+  updatedAt        DateTime           @default(now())
   //
-  user      User?              @relation(fields: [userId], references: [id])
-  userId    String?
+  user             User?              @relation(fields: [userId], references: [id])
+  userId           String?
   //
-  services  ServiceToProgram[]
-  clients   ProgramToClient[]
+  services         ServiceToProgram[]
+  programToClients ProgramToClient[]
 }
+model ProgramToClient {
+  id              String                     @id
+  name            String
+  notes           String?
+  createdAt       DateTime                   @default(now())
+  updatedAt       DateTime                   @default(now())
+  //
+  services        ServiceToProgramToClient[]
+  //
+  parentProgram   Program                    @relation(fields: [parentProgramId], references: [id])
+  parentProgramId String
+  client          Client                     @relation(fields: [clientId], references: [id])
+  clientId        String
+}
+
 model Client {
   id        String            @id
   firstName String
   lastName  String?
@@ -117,15 +133,18 @@
   @@id([serviceId, programId])
 }
-model ProgramToClient {
-  createdAt DateTime @default(now())
-  updatedAt DateTime @default(now())
+model ServiceToProgramToClient {
+  quantity  Int
+  booked    Int
+  used      Int
+  createdAt DateTime        @default(now())
+  updatedAt DateTime        @default(now())
   //
-  program   Program  @relation(fields: [programId], references: [id])
+  service   Service         @relation(fields: [serviceId], references: [id])
+  serviceId String
+  program   ProgramToClient @relation(fields: [programId], references: [id])
   programId String
-  client    Client   @relation(fields: [clientId], references: [id])
-  clientId  String
-  @@id([programId, clientId])
+  @@id([serviceId, programId])
 }
```


