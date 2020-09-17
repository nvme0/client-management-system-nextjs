# Migration `20200914020233-add-programs-to-clients`

This migration has been generated at 9/14/2020, 12:02:33 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `cms`.`ProgramToClient` (
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`programId` varchar(191) NOT NULL ,
`clientId` varchar(191) NOT NULL ,
PRIMARY KEY (`programId`,`clientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `cms`.`ProgramToClient` ADD FOREIGN KEY (`programId`) REFERENCES `cms`.`Program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `cms`.`ProgramToClient` ADD FOREIGN KEY (`clientId`) REFERENCES `cms`.`Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200905080804-add-all-day-flag-to-calendar-event..20200914020233-add-programs-to-clients
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
@@ -71,8 +71,9 @@
   userId     String?
   //
   services   ServiceToProgram[]
   categories Category[]
+  clients    ProgramToClient[]
 }
 model Category {
   id        String    @id
@@ -103,8 +104,9 @@
   userId    String?
   //
   events    CalendarEvent[]
   services  ServiceToClient[]
+  programs  ProgramToClient[]
 }
 model ServiceToClient {
   quantity  Int
@@ -130,4 +132,16 @@
   programId String
   @@id([serviceId, programId])
 }
+
+model ProgramToClient {
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+  //
+  program   Program  @relation(fields: [programId], references: [id])
+  programId String
+  client    Client   @relation(fields: [clientId], references: [id])
+  clientId  String
+
+  @@id([programId, clientId])
+}
```


