# Migration `20200920052509-change-installment-amount-to-type-string`

This migration has been generated at 9/20/2020, 3:25:09 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`Installment` MODIFY `amount` varchar(191) NOT NULL
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920051916-add-currency-to-installment..20200920052509-change-installment-amount-to-type-string
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
@@ -148,9 +148,9 @@
 }
 model Installment {
   id       String   @id
-  amount   Int
+  amount   String
   currency String
   date     DateTime
   //
   Client   Client?  @relation(fields: [clientId], references: [id])
```


