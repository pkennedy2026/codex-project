"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_config_1 = require("../typeorm.config");
const user_entity_1 = require("../modules/auth/user.entity");
const tenant_entity_1 = require("../modules/tenants/tenant.entity");
const plan_entity_1 = require("../modules/plans/plan.entity");
const subscriber_entity_1 = require("../modules/subscribers/subscriber.entity");
const bcrypt = require("bcryptjs");
async function run() {
    await typeorm_config_1.default.initialize();
    const userRepo = typeorm_config_1.default.getRepository(user_entity_1.User);
    const tenantRepo = typeorm_config_1.default.getRepository(tenant_entity_1.Tenant);
    const planRepo = typeorm_config_1.default.getRepository(plan_entity_1.Plan);
    const subscriberRepo = typeorm_config_1.default.getRepository(subscriber_entity_1.Subscriber);
    let demoTenant = await tenantRepo.findOne({ where: { slug: 'kennet-demo' } });
    if (!demoTenant) {
        demoTenant = tenantRepo.create({ name: 'KenNet Demo', slug: 'kennet-demo', isActive: true });
        demoTenant = await tenantRepo.save(demoTenant);
        console.log('Seeded tenant:', demoTenant.slug);
    }
    let demoPlan = await planRepo.findOne({ where: { name: 'Fiber 200' } });
    if (!demoPlan) {
        demoPlan = planRepo.create({
            tenant: demoTenant,
            name: 'Fiber 200',
            price: 79.99,
            downloadSpeed: 200,
            uploadSpeed: 200,
            isPppoe: true,
        });
        demoPlan = await planRepo.save(demoPlan);
        console.log('Seeded plan:', demoPlan.name);
    }
    const demoUsername = 'demo.user';
    let demoSubscriber = await subscriberRepo.findOne({ where: { username: demoUsername } });
    if (!demoSubscriber) {
        demoSubscriber = subscriberRepo.create({
            tenant: demoTenant,
            plan: demoPlan,
            username: demoUsername,
            fullName: 'Demo User',
            email: 'demo@kennet.test',
            status: 'active',
        });
        demoSubscriber = await subscriberRepo.save(demoSubscriber);
        console.log('Seeded subscriber:', demoSubscriber.username);
    }
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const password = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe123!';
    const existing = await userRepo.findOne({ where: { email } });
    if (existing) {
        console.log('Admin already exists:', email);
        await typeorm_config_1.default.destroy();
        return;
    }
    const user = userRepo.create({
        email,
        fullName: 'Super Admin',
        role: 'super_admin',
        passwordHash: await bcrypt.hash(password, 10),
        isActive: true,
    });
    await userRepo.save(user);
    console.log('Seeded admin user:', email);
    await typeorm_config_1.default.destroy();
}
run().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map