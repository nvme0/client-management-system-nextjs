# Migration `20200920040241-add-installments-to-client`

This migration has been generated at 9/20/2020, 2:02:41 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `cms`.`Installment` (
`id` varchar(191)  NOT NULL ,
`amount` int  NOT NULL ,
`date` datetime(3)  NOT NULL ,
`clientId` varchar(191)  ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `cms`.`Installment` ADD FOREIGN KEY (`clientId`) REFERENCES `cms`.`Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200916125533-remove-parent-program-field-from-program-to-client..20200920040241-add-installments-to-client
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
@@ -86,24 +86,25 @@
   clientId  String
 }
 model Client {
-  id        String            @id
-  firstName String
-  lastName  String?
-  email     String?
-  phone     String?
-  address   String?
-  notes     String?
-  createdAt DateTime          @default(now())
-  updatedAt DateTime          @default(now())
+  id           String            @id
+  firstName    String
+  lastName     String?
+  email        String?
+  phone        String?
+  address      String?
+  notes        String?
+  createdAt    DateTime          @default(now())
+  updatedAt    DateTime          @default(now())
   //
-  user      User?             @relation(fields: [userId], references: [id])
-  userId    String?
+  user         User?             @relation(fields: [userId], references: [id])
+  userId       String?
   //
-  events    CalendarEvent[]
-  services  ServiceToClient[]
-  programs  ProgramToClient[]
+  events       CalendarEvent[]
+  services     ServiceToClient[]
+  programs     ProgramToClient[]
+  installments Installment[]
 }
 model ServiceToClient {
   quantity  Int
@@ -144,4 +145,13 @@
   programId String
   @@id([serviceId, programId])
 }
+
+model Installment {
+  id       String   @id
+  amount   Int
+  date     DateTime
+  //
+  Client   Client?  @relation(fields: [clientId], references: [id])
+  clientId String?
+}
```


