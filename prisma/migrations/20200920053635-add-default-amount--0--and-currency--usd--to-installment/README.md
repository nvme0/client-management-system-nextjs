# Migration `20200920053635-add-default-amount--0--and-currency--usd--to-installment`

This migration has been generated at 9/20/2020, 3:36:35 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`Installment` MODIFY `amount` varchar(191) NOT NULL DEFAULT '0',
MODIFY `currency` varchar(191) NOT NULL DEFAULT 'USD'
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920052509-change-installment-amount-to-type-string..20200920053635-add-default-amount--0--and-currency--usd--to-installment
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
@@ -148,10 +148,10 @@
 }
 model Installment {
   id       String   @id
-  amount   String
-  currency String
+  amount   String   @default("0")
+  currency String   @default("USD")
   date     DateTime
   //
   Client   Client?  @relation(fields: [clientId], references: [id])
   clientId String?
```


