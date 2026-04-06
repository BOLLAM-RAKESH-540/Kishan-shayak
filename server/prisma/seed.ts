import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // 1. Clean existing shops to avoid duplicates
  await prisma.supplierShop.deleteMany({});

  // 2. Add Dummy Shops
  await prisma.supplierShop.createMany({
    data: [
      {
        name: "Kisan Seva Kendra (Govt)",
        type: "GOVERNMENT_SOCIETY",
        address: "Main Road, Near Bus Stand, Warangal",
        contactNumber: "0870-2456789",
        latitude: 17.9689,
        longitude: 79.5941,
        // Using a string for items is simpler for now
        // In schema we used String[], so we pass an array
        availableItems: ["Urea", "DAP", "Potash"]
      },
      {
        name: "Sri Venkateswara Agro Agency",
        type: "PRIVATE_SHOP",
        address: "Shop No 4, Gandhi Market, Khammam",
        contactNumber: "9848012345",
        latitude: 17.2473,
        longitude: 80.1514,
        availableItems: ["Pesticides", "Hybrid Seeds", "Sprayers"]
      },
      {
        name: "Rythu Bharosa Center",
        type: "GOVERNMENT_SOCIETY",
        address: "Village Square, Karimnagar",
        contactNumber: "1800-425-1111",
        latitude: 18.4386,
        longitude: 79.1288,
        availableItems: ["Nano Urea", "Zinc", "Subsidized Seeds"]
      }
    ]
  });

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });