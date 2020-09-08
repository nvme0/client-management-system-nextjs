# Migration `20200905080804-add-all-day-flag-to-calendar-event`

This migration has been generated at 9/5/2020, 6:08:04 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
ALTER TABLE `cms`.`CalendarEvent` ADD COLUMN `allDay` boolean NOT NULL ;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200901084701-add-user-to-category..20200905080804-add-all-day-flag-to-calendar-event
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
@@ -29,8 +29,9 @@
   id        String   @id
   title     String
   start     DateTime
   end       DateTime
+  allDay    Boolean
   notes     String?
   createdAt DateTime @default(now())
   updatedAt DateTime @default(now())
   //
```


