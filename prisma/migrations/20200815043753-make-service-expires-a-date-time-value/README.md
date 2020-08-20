# Migration `20200815043753-make-service-expires-a-date-time-value`

This migration has been generated at 8/15/2020, 2:37:53 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`Service` MODIFY `expires` datetime(3);
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200815030351-initial-schema..20200815043753-make-service-expires-a-date-time-value
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
@@ -57,9 +57,9 @@
 model Service {
   id        String             @id
   name      String
   duration  String?
-  expires   String?
+  expires   DateTime?
   notes     String?
   createdAt DateTime           @default(now())
   updatedAt DateTime           @default(now())
   //
```


