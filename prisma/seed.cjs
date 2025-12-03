const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@kwale.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (existing) {
    console.log("Admin user already exists:", adminEmail);
    return;
  }

  const hashed = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: "Kwale Admin",
      password: hashed,
      role: Role.ADMIN,
    },
  });

  console.log("Seeded admin user:");
  console.log("  email:", adminEmail);
  console.log("  password:", adminPassword);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
