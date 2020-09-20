# Migration `20200920051916-add-currency-to-installment`

This migration has been generated at 9/20/2020, 3:19:16 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`Installment` ADD COLUMN `currency` varchar(191)  NOT NULL 
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920040241-add-installments-to-client..20200920051916-add-currency-to-installment
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
@@ -149,8 +149,9 @@
 model Installment {
   id       String   @id
   amount   Int
+  currency String
   date     DateTime
   //
   Client   Client?  @relation(fields: [clientId], references: [id])
   clientId String?
```


