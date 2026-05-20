import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_PRODUCTS = [
  {
    name: "Midnight Lavender", tagline: "The essence of calm",
    description: "Cold-pressed French lavender entwined with raw shea butter. Promotes deep relaxation and skin restoration.",
    basePrice: 45, themeColor: "#E2D9F3", buttonColor: "#583c87", accentColor: "#9b72cf", dropColor: "#b8a0e0",
    badge: "BESTSELLER", ingredients: ["French Lavender", "Raw Shea Butter", "Vitamin E"],
    bgGradient: "from-[#1a0a2e] via-[#16213e] to-[#0f0e17]", spriteRow: 0, spriteCol: 0, category: "SOAP"
  },
  {
    name: "Cinnamon Sandalwood", tagline: "Warm & Earthy",
    description: "A dual-exfoliating structure infused with century-old red sandalwood extract and cinnamon bark.",
    basePrice: 55, themeColor: "#F4E0D1", buttonColor: "#8b5a2b", accentColor: "#d4874a", dropColor: "#e8a87c",
    badge: "LIMITED", ingredients: ["Red Sandalwood", "Cinnamon Bark", "Coconut Oil"],
    bgGradient: "from-[#1a0800] via-[#2d1200] to-[#120800]", spriteRow: 0, spriteCol: 1, category: "SOAP"
  },
  {
    name: "Aloe & Red Clay", tagline: "Purifying Blend",
    description: "Moroccan red clay combined with fresh aloe vera. Extracts impurities while deeply hydrating.",
    basePrice: 38, themeColor: "#FFCBA4", buttonColor: "#c24a2e", accentColor: "#e05a3a", dropColor: "#ff8a70",
    badge: "ORGANIC", ingredients: ["Moroccan Red Clay", "Aloe Vera", "Rose Hip"],
    bgGradient: "from-[#1a0500] via-[#2a0e00] to-[#150800]", spriteRow: 0, spriteCol: 2, category: "SOAP"
  },
  {
    name: "Vanilla Macadamia", tagline: "Deep Moisture",
    description: "Rich macadamia nut oil and sweet vanilla bean. A buttery lather for intensely dry skin.",
    basePrice: 42, themeColor: "#FDF5E6", buttonColor: "#d4a373", accentColor: "#c8956c", dropColor: "#ddb07e",
    badge: "AWARD WINNER", ingredients: ["Macadamia Oil", "Vanilla Bean", "Cocoa Butter"],
    bgGradient: "from-[#110d00] via-[#1e1500] to-[#0d0a00]", spriteRow: 0, spriteCol: 3, category: "SOAP"
  },
  {
    name: "Fresh Aloe Mint", tagline: "Cooling Relief",
    description: "Crisp peppermint leaves and raw aloe juice. Invigorates the senses and cools the dermis.",
    basePrice: 35, themeColor: "#E0F8D8", buttonColor: "#558b2f", accentColor: "#6aab3a", dropColor: "#8dd170",
    badge: "VEGAN", ingredients: ["Peppermint", "Aloe Juice", "Green Tea Extract"],
    bgGradient: "from-[#001a00] via-[#001200] to-[#000d00]", spriteRow: 0, spriteCol: 4, category: "SOAP"
  }
];

async function main() {
  console.log('Seeding Database with Dynamic Products...');
  await prisma.product.deleteMany({});
  
  for (const prod of SEED_PRODUCTS) {
    await prisma.product.create({
      data: {
        ...prod,
        category: 'SOAP'
      }
    });
  }
  console.log('Seeding Complete! Database is populated.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
