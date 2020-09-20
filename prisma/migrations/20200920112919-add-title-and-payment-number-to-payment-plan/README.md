# Migration `20200920112919-add-title-and-payment-number-to-payment-plan`

This migration has been generated at 9/20/2020, 9:29:19 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`PaymentPlan` ADD COLUMN `title` varchar(191)  NOT NULL ,
ADD COLUMN `paymentNumber` int  NOT NULL 
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920085818-add-notes-to-payment-plan..20200920112919-add-title-and-payment-number-to-payment-plan
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
@@ -158,11 +158,13 @@
   paymentPlanId String?
 }
 model PaymentPlan {
-  id           String        @id
-  installments Installment[]
-  notes        String?
+  id            String        @id
+  title         String
+  paymentNumber Int
+  installments  Installment[]
+  notes         String?
   //
-  client       Client?       @relation(fields: [clientId], references: [id])
-  clientId     String?
+  client        Client?       @relation(fields: [clientId], references: [id])
+  clientId      String?
 }
```


