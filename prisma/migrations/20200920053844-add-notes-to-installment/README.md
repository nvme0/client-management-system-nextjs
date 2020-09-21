# Migration `20200920053844-add-notes-to-installment`

This migration has been generated at 9/20/2020, 3:38:44 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`Installment` ADD COLUMN `notes` varchar(191)  
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920053635-add-default-amount--0--and-currency--usd--to-installment..20200920053844-add-notes-to-installment
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
@@ -151,8 +151,9 @@
   id       String   @id
   amount   String   @default("0")
   currency String   @default("USD")
   date     DateTime
+  notes    String?
   //
   Client   Client?  @relation(fields: [clientId], references: [id])
   clientId String?
 }
```


