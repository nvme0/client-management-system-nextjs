# Migration `20200920074553-unlink-client-and-installment--create-payment-plan-for-client--link-installment-and-payment-plan`

This migration has been generated at 9/20/2020, 5:45:53 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`Installment` DROP FOREIGN KEY `Installment_ibfk_1`

ALTER TABLE `cms`.`Installment` DROP COLUMN `clientId`,
ADD COLUMN `paymentPlanId` varchar(191)  

CREATE TABLE `cms`.`PaymentPlan` (
`id` varchar(191)  NOT NULL ,
`clientId` varchar(191)  ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

ALTER TABLE `cms`.`PaymentPlan` ADD FOREIGN KEY (`clientId`) REFERENCES `cms`.`Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `cms`.`Installment` ADD FOREIGN KEY (`paymentPlanId`) REFERENCES `cms`.`PaymentPlan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920065030-fix-typo-client----client-in-installment..20200920074553-unlink-client-and-installment--create-payment-plan-for-client--link-installment-and-payment-plan
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
@@ -102,9 +102,9 @@
   //
   events       CalendarEvent[]
   services     ServiceToClient[]
   programs     ProgramToClient[]
-  installments Installment[]
+  paymentPlans PaymentPlan[]
 }
 model ServiceToClient {
   quantity  Int
@@ -147,13 +147,21 @@
   @@id([serviceId, programId])
 }
 model Installment {
-  id       String   @id
-  amount   String   @default("0")
-  currency String   @default("USD")
-  date     DateTime
-  notes    String?
+  id            String       @id
+  amount        String       @default("0")
+  currency      String       @default("USD")
+  date          DateTime
+  notes         String?
   //
-  client   Client?  @relation(fields: [clientId], references: [id])
+  paymentPlan   PaymentPlan? @relation(fields: [paymentPlanId], references: [id])
+  paymentPlanId String?
+}
+
+model PaymentPlan {
+  id           String        @id
+  installments Installment[]
+
+  client   Client? @relation(fields: [clientId], references: [id])
   clientId String?
 }
```


