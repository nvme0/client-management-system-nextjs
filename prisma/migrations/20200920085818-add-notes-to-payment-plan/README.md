# Migration `20200920085818-add-notes-to-payment-plan`

This migration has been generated at 9/20/2020, 6:58:18 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`PaymentPlan` ADD COLUMN `notes` varchar(191)  
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920074553-unlink-client-and-installment--create-payment-plan-for-client--link-installment-and-payment-plan..20200920085818-add-notes-to-payment-plan
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
@@ -160,8 +160,9 @@
 model PaymentPlan {
   id           String        @id
   installments Installment[]
-
-  client   Client? @relation(fields: [clientId], references: [id])
-  clientId String?
+  notes        String?
+  //
+  client       Client?       @relation(fields: [clientId], references: [id])
+  clientId     String?
 }
```


