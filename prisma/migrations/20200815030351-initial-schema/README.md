# Migration `20200815030351-initial-schema`

This migration has been generated at 8/15/2020, 1:03:51 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE `cms`.`User` (
`id` varchar(191) NOT NULL ,
`email` varchar(191) NOT NULL ,
`password` varchar(191) NOT NULL ,
`confirmed` boolean NOT NULL DEFAULT true,
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`userProfileId` varchar(191) NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `cms`.`UserProfile` (
`id` varchar(191) NOT NULL ,
`firstName` varchar(191)  ,
`lastName` varchar(191)  ,
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `cms`.`CalendarEvent` (
`id` varchar(191) NOT NULL ,
`title` varchar(191) NOT NULL ,
`start` datetime(3) NOT NULL ,
`end` datetime(3) NOT NULL ,
`notes` varchar(191)  ,
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`userId` varchar(191)  ,
`clientId` varchar(191)  ,
`serviceId` varchar(191)  ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `cms`.`Service` (
`id` varchar(191) NOT NULL ,
`name` varchar(191) NOT NULL ,
`duration` varchar(191)  ,
`expires` varchar(191)  ,
`notes` varchar(191)  ,
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`userId` varchar(191)  ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `cms`.`Program` (
`id` varchar(191) NOT NULL ,
`name` varchar(191) NOT NULL ,
`notes` varchar(191)  ,
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`userId` varchar(191)  ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `cms`.`Category` (
`id` varchar(191) NOT NULL ,
`name` varchar(191) NOT NULL ,
`for` varchar(191) NOT NULL ,
`notes` varchar(191)  ,
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `cms`.`Client` (
`id` varchar(191) NOT NULL ,
`notes` varchar(191)  ,
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`userId` varchar(191)  ,
`clientProfileId` varchar(191) NOT NULL ,
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `cms`.`ClientProfile` (
`id` varchar(191) NOT NULL ,
`firstName` varchar(191) NOT NULL ,
`lastName` varchar(191)  ,
`email` varchar(191)  ,
`phone` varchar(191)  ,
`address` varchar(191)  ,
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `cms`.`ServiceToClient` (
`quantity` int NOT NULL ,
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`serviceId` varchar(191) NOT NULL ,
`clientId` varchar(191) NOT NULL ,
PRIMARY KEY (`serviceId`,`clientId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `cms`.`ServiceToProgram` (
`quantity` int NOT NULL ,
`createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
`serviceId` varchar(191) NOT NULL ,
`programId` varchar(191) NOT NULL ,
PRIMARY KEY (`serviceId`,`programId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE TABLE `cms`.`_CategoryToProgram` (
`A` varchar(191) NOT NULL ,
`B` varchar(191) NOT NULL 
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci

CREATE UNIQUE INDEX `User.email_unique` ON `cms`.`User`(`email`)

CREATE UNIQUE INDEX `_CategoryToProgram_AB_unique` ON `cms`.`_CategoryToProgram`(`A`,`B`)

CREATE  INDEX `_CategoryToProgram_B_index` ON `cms`.`_CategoryToProgram`(`B`)

ALTER TABLE `cms`.`User` ADD FOREIGN KEY (`userProfileId`) REFERENCES `cms`.`UserProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `cms`.`CalendarEvent` ADD FOREIGN KEY (`userId`) REFERENCES `cms`.`User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `cms`.`CalendarEvent` ADD FOREIGN KEY (`clientId`) REFERENCES `cms`.`Client`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `cms`.`CalendarEvent` ADD FOREIGN KEY (`serviceId`) REFERENCES `cms`.`Service`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `cms`.`Service` ADD FOREIGN KEY (`userId`) REFERENCES `cms`.`User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `cms`.`Program` ADD FOREIGN KEY (`userId`) REFERENCES `cms`.`User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `cms`.`Client` ADD FOREIGN KEY (`userId`) REFERENCES `cms`.`User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE `cms`.`Client` ADD FOREIGN KEY (`clientProfileId`) REFERENCES `cms`.`ClientProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `cms`.`ServiceToClient` ADD FOREIGN KEY (`serviceId`) REFERENCES `cms`.`Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `cms`.`ServiceToClient` ADD FOREIGN KEY (`clientId`) REFERENCES `cms`.`Client`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `cms`.`ServiceToProgram` ADD FOREIGN KEY (`serviceId`) REFERENCES `cms`.`Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `cms`.`ServiceToProgram` ADD FOREIGN KEY (`programId`) REFERENCES `cms`.`Program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `cms`.`_CategoryToProgram` ADD FOREIGN KEY (`A`) REFERENCES `cms`.`Category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE `cms`.`_CategoryToProgram` ADD FOREIGN KEY (`B`) REFERENCES `cms`.`Program`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200815030351-initial-schema
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,151 @@
+// This is your Prisma schema file,
+// learn more about it in the docs: https://pris.ly/d/prisma-schema
+
+datasource db {
+  provider = "mysql"
+  url = "***"
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model User {
+  id            String          @id @default(uuid())
+  email         String          @unique
+  password      String
+  confirmed     Boolean         @default(true)
+  createdAt     DateTime        @default(now())
+  updatedAt     DateTime        @default(now())
+  //
+  profile       UserProfile     @relation(fields: [userProfileId], references: [id])
+  userProfileId String
+  //
+  services      Service[]
+  programs      Program[]
+  clients       Client[]
+  events        CalendarEvent[]
+}
+
+model UserProfile {
+  id        String   @id
+  firstName String?
+  lastName  String?
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+  //
+  user      User[]
+}
+
+model CalendarEvent {
+  id        String   @id
+  title     String
+  start     DateTime
+  end       DateTime
+  notes     String?
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+  //
+  user      User?    @relation(fields: [userId], references: [id])
+  userId    String?
+  client    Client?  @relation(fields: [clientId], references: [id])
+  clientId  String?
+  service   Service? @relation(fields: [serviceId], references: [id])
+  serviceId String?
+}
+
+model Service {
+  id        String             @id
+  name      String
+  duration  String?
+  expires   String?
+  notes     String?
+  createdAt DateTime           @default(now())
+  updatedAt DateTime           @default(now())
+  //
+  user      User?              @relation(fields: [userId], references: [id])
+  userId    String?
+  //
+  events    CalendarEvent[]
+  clients   ServiceToClient[]
+  programs  ServiceToProgram[]
+}
+
+model Program {
+  id         String             @id
+  name       String
+  notes      String?
+  createdAt  DateTime           @default(now())
+  updatedAt  DateTime           @default(now())
+  //
+  user       User?              @relation(fields: [userId], references: [id])
+  userId     String?
+  //
+  services   ServiceToProgram[]
+  categories Category[]
+}
+
+model Category {
+  id        String    @id
+  name      String
+  for       String
+  notes     String?
+  createdAt DateTime  @default(now())
+  updatedAt DateTime  @default(now())
+  //
+  programs  Program[]
+}
+
+model Client {
+  id              String            @id
+  notes           String?
+  createdAt       DateTime          @default(now())
+  updatedAt       DateTime          @default(now())
+  //
+  user            User?             @relation(fields: [userId], references: [id])
+  userId          String?
+  profile         ClientProfile     @relation(fields: [clientProfileId], references: [id])
+  clientProfileId String
+  //
+  events          CalendarEvent[]
+  services        ServiceToClient[]
+}
+
+model ClientProfile {
+  id        String   @id
+  firstName String
+  lastName  String?
+  email     String?
+  phone     String?
+  address   String?
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+  //
+  client    Client[]
+}
+
+model ServiceToClient {
+  quantity  Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+  //
+  service   Service  @relation(fields: [serviceId], references: [id])
+  serviceId String
+  client    Client   @relation(fields: [clientId], references: [id])
+  clientId  String
+
+  @@id([serviceId, clientId])
+}
+
+model ServiceToProgram {
+  quantity  Int
+  createdAt DateTime @default(now())
+  updatedAt DateTime @default(now())
+  //
+  service   Service  @relation(fields: [serviceId], references: [id])
+  serviceId String
+  program   Program  @relation(fields: [programId], references: [id])
+  programId String
+
+  @@id([serviceId, programId])
+}
```


