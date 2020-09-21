# Migration `20200920065030-fix-typo-client----client-in-installment`

This migration has been generated at 9/20/2020, 4:50:30 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql

```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200920053844-add-notes-to-installment..20200920065030-fix-typo-client----client-in-installment
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
@@ -153,7 +153,7 @@
   currency String   @default("USD")
   date     DateTime
   notes    String?
   //
-  Client   Client?  @relation(fields: [clientId], references: [id])
+  client   Client?  @relation(fields: [clientId], references: [id])
   clientId String?
 }
```


