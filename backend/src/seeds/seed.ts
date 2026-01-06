import 'reflect-metadata';
import dataSource from '../typeorm.config';
import { User } from '../modules/auth/user.entity';
import { Tenant } from '../modules/tenants/tenant.entity';
import { Plan } from '../modules/plans/plan.entity';
import { Subscriber } from '../modules/subscribers/subscriber.entity';
import * as bcrypt from 'bcryptjs';

async function run() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);
  const tenantRepo = dataSource.getRepository(Tenant);
  const planRepo = dataSource.getRepository(Plan);
  const subscriberRepo = dataSource.getRepository(Subscriber);

  // Seed demo tenant/plan/subscriber
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
    await dataSource.destroy();
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
  await dataSource.destroy();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
