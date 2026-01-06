"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Init1704540000000 = void 0;
class Init1704540000000 {
    constructor() {
        this.name = 'Init1704540000000';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" varchar NOT NULL UNIQUE,
        "slug" varchar NOT NULL UNIQUE,
        "logoUrl" varchar,
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "plans" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants" ("id"),
        "name" varchar NOT NULL,
        "price" numeric(12,2) NOT NULL,
        "downloadSpeed" integer,
        "uploadSpeed" integer,
        "dataCap" integer,
        "validityDays" integer,
        "billingCycle" varchar,
        "isHotspot" boolean NOT NULL DEFAULT false,
        "isPppoe" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "subscribers" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants" ("id"),
        "username" varchar NOT NULL,
        "fullName" varchar,
        "email" varchar,
        "phone" varchar,
        "planId" uuid REFERENCES "plans" ("id"),
        "status" varchar NOT NULL DEFAULT 'active',
        "connectionType" varchar,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar NOT NULL UNIQUE,
        "passwordHash" varchar NOT NULL,
        "fullName" varchar,
        "role" varchar NOT NULL,
        "tenantId" uuid REFERENCES "tenants" ("id"),
        "isActive" boolean NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants" ("id"),
        "subscriberId" uuid NOT NULL REFERENCES "subscribers" ("id"),
        "invoiceNumber" varchar NOT NULL,
        "amount" numeric(12,2) NOT NULL,
        "tax" numeric(12,2) NOT NULL DEFAULT 0,
        "total" numeric(12,2) NOT NULL,
        "status" varchar NOT NULL DEFAULT 'pending',
        "dueDate" date NOT NULL,
        "paidAt" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "payments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants" ("id"),
        "invoiceId" uuid NOT NULL REFERENCES "invoices" ("id"),
        "amount" numeric(12,2) NOT NULL,
        "paymentMethod" varchar NOT NULL,
        "reference" varchar,
        "status" varchar NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "vouchers" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants" ("id"),
        "planId" uuid NOT NULL REFERENCES "plans" ("id"),
        "code" varchar NOT NULL UNIQUE,
        "isUsed" boolean NOT NULL DEFAULT false,
        "validityMinutes" integer NOT NULL DEFAULT 60,
        "expiresAt" TIMESTAMP,
        "usedAt" TIMESTAMP,
        "usedById" uuid REFERENCES "subscribers" ("id"),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "nas_devices" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants" ("id"),
        "name" varchar NOT NULL,
        "ipAddress" varchar NOT NULL,
        "secret" varchar,
        "type" varchar NOT NULL DEFAULT 'mikrotik',
        "isActive" boolean NOT NULL DEFAULT true,
        "vpnIp" varchar,
        "tunnelPort" integer,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "access_points" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants" ("id"),
        "name" varchar NOT NULL,
        "macAddress" varchar NOT NULL,
        "ipAddress" varchar,
        "status" varchar NOT NULL DEFAULT 'unknown',
        "firmwareVersion" varchar,
        "ssidConfig" varchar,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "wallets" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants" ("id"),
        "balance" numeric(14,2) NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "settlements" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants" ("id"),
        "reportNumber" varchar NOT NULL,
        "periodStart" date NOT NULL,
        "periodEnd" date NOT NULL,
        "grossRevenue" numeric(14,2) NOT NULL,
        "commissionAmount" numeric(14,2) NOT NULL,
        "taxAmount" numeric(14,2) NOT NULL,
        "netRevenue" numeric(14,2) NOT NULL,
        "status" varchar NOT NULL DEFAULT 'pending',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "payouts" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants" ("id"),
        "settlementId" uuid NOT NULL REFERENCES "settlements" ("id"),
        "payoutNumber" varchar NOT NULL,
        "amount" numeric(14,2) NOT NULL,
        "status" varchar NOT NULL DEFAULT 'pending',
        "payoutMethod" varchar,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "sessions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "tenantId" uuid NOT NULL REFERENCES "tenants" ("id"),
        "subscriberId" uuid NOT NULL REFERENCES "subscribers" ("id"),
        "sessionType" varchar NOT NULL,
        "status" varchar NOT NULL DEFAULT 'active',
        "startedAt" TIMESTAMP NOT NULL,
        "endedAt" TIMESTAMP,
        "bytesIn" bigint NOT NULL DEFAULT 0,
        "bytesOut" bigint NOT NULL DEFAULT 0,
        "nasIp" varchar,
        "framedIp" varchar,
        "macAddress" varchar,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "payouts"`);
        await queryRunner.query(`DROP TABLE "settlements"`);
        await queryRunner.query(`DROP TABLE "wallets"`);
        await queryRunner.query(`DROP TABLE "access_points"`);
        await queryRunner.query(`DROP TABLE "nas_devices"`);
        await queryRunner.query(`DROP TABLE "vouchers"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "subscribers"`);
        await queryRunner.query(`DROP TABLE "plans"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
        await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
    }
}
exports.Init1704540000000 = Init1704540000000;
//# sourceMappingURL=1704540000000-init.js.map