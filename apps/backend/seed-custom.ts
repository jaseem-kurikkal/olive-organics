import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const contentPath = path.join(__dirname, '../frontend/src/content.json');
  const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

  console.log('Seeding CustomSizes...');
  for (const size of content.sizes) {
    await prisma.customSize.upsert({
      where: { sizeId: size.id },
      update: {
        name: size.name,
        price: size.price,
      },
      create: {
        sizeId: size.id,
        name: size.name,
        price: size.price,
      },
    });
  }

  console.log('Seeding CustomIngredients...');
  for (const ing of content.ingredients) {
    await prisma.customIngredient.upsert({
      where: { ingredientId: ing.id },
      update: {
        name: ing.name,
        price: ing.price,
        desc: ing.desc,
        color: ing.color,
      },
      create: {
        ingredientId: ing.id,
        name: ing.name,
        price: ing.price,
        desc: ing.desc,
        color: ing.color,
      },
    });
  }

  console.log('Seeding CustomFragrances...');
  for (const frag of content.fragrances) {
    await prisma.customFragrance.upsert({
      where: { fragranceId: frag.id },
      update: {
        name: frag.name,
        price: frag.price,
        color: frag.color,
      },
      create: {
        fragranceId: frag.id,
        name: frag.name,
        price: frag.price,
        color: frag.color,
      },
    });
  }

  console.log('Done seeding customizer options.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
