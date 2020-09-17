# Migration `20200916125533-remove-parent-program-field-from-program-to-client`

This migration has been generated at 9/16/2020, 10:55:33 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`ProgramToClient` DROP FOREIGN KEY `ProgramToClient_ibfk_3`

ALTER TABLE `cms`.`ProgramToClient` DROP COLUMN `parentProgramId`
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200916124048-add-service-to-program-to-client--extension-of-service-to-program-for-client---modify-program-to-client--program-for-client..20200916125533-remove-parent-program-field-from-program-to-client
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
@@ -60,34 +60,31 @@
   serviceToProgramToClients ServiceToProgramToClient[]
 }
 model Program {
-  id               String             @id
-  name             String
-  notes            String?
-  createdAt        DateTime           @default(now())
-  updatedAt        DateTime           @default(now())
+  id        String             @id
+  name      String
+  notes     String?
+  createdAt DateTime           @default(now())
+  updatedAt DateTime           @default(now())
   //
-  user             User?              @relation(fields: [userId], references: [id])
-  userId           String?
+  user      User?              @relation(fields: [userId], references: [id])
+  userId    String?
   //
-  services         ServiceToProgram[]
-  programToClients ProgramToClient[]
+  services  ServiceToProgram[]
 }
 model ProgramToClient {
-  id              String                     @id
-  name            String
-  notes           String?
-  createdAt       DateTime                   @default(now())
-  updatedAt       DateTime                   @default(now())
+  id        String                     @id
+  name      String
+  notes     String?
+  createdAt DateTime                   @default(now())
+  updatedAt DateTime                   @default(now())
   //
-  services        ServiceToProgramToClient[]
+  services  ServiceToProgramToClient[]
   //
-  parentProgram   Program                    @relation(fields: [parentProgramId], references: [id])
-  parentProgramId String
-  client          Client                     @relation(fields: [clientId], references: [id])
-  clientId        String
+  client    Client                     @relation(fields: [clientId], references: [id])
+  clientId  String
 }
 model Client {
   id        String            @id
```


