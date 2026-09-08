"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
const prisma = new client_1.PrismaClient({ adapter });
const MODEL_PRESETS = [
    {
        name: 'Amara',
        heightCm: 177,
        bustCm: 86,
        waistCm: 66,
        hipsCm: 96,
        shoulderCm: 38,
        inseamCm: 80,
        skinTone: '#A0714F',
        skinToneName: 'Rich Umber',
        hairColour: 'black',
        ageRange: '26-35',
        build: 'athletic',
        gender: 'feminine',
        baseImg: '/models/dress_fitted.jpg',
        description: 'Sculpted proportions, fluid drape stance.',
    },
    {
        name: 'Elena',
        heightCm: 180,
        bustCm: 84,
        waistCm: 63,
        hipsCm: 91,
        shoulderCm: 37,
        inseamCm: 82,
        skinTone: '#FDDBB4',
        skinToneName: 'Fair Porcelain',
        hairColour: 'blonde',
        ageRange: '18-25',
        build: 'slim',
        gender: 'feminine',
        baseImg: '/models/female_base.jpg',
        description: 'Slender runway posture, clean vertical line.',
    },
    {
        name: 'Kaito',
        heightCm: 185,
        bustCm: 96,
        waistCm: 76,
        hipsCm: 99,
        shoulderCm: 44,
        inseamCm: 84,
        skinTone: '#F1C27D',
        skinToneName: 'Light Warm',
        hairColour: 'black',
        ageRange: '26-35',
        build: 'athletic',
        gender: 'masculine',
        baseImg: '/models/issey_pleats_fitted.jpg',
        description: 'Lean architectural frame, tailored shoulder stance.',
    },
    {
        name: 'Adeyemi',
        heightCm: 188,
        bustCm: 104,
        waistCm: 81,
        hipsCm: 104,
        shoulderCm: 48,
        inseamCm: 86,
        skinTone: '#6B4226',
        skinToneName: 'Deep Ebony',
        hairColour: 'black',
        ageRange: '26-35',
        build: 'athletic',
        gender: 'masculine',
        baseImg: '/models/blazer_fitted.jpg',
        description: 'Structured athletic build, broad chest line.',
    },
    {
        name: 'Sofia',
        heightCm: 165,
        bustCm: 94,
        waistCm: 74,
        hipsCm: 102,
        shoulderCm: 39,
        inseamCm: 74,
        skinTone: '#C8956C',
        skinToneName: 'Golden Tan',
        hairColour: 'brown',
        ageRange: '36-45',
        build: 'average',
        gender: 'feminine',
        baseImg: '/models/female_base.jpg',
        description: 'Warm proportions, relaxed everyday stance.',
    },
    {
        name: 'Marcus',
        heightCm: 178,
        bustCm: 99,
        waistCm: 84,
        hipsCm: 100,
        shoulderCm: 45,
        inseamCm: 80,
        skinTone: '#4A2C17',
        skinToneName: 'Deep Mahogany',
        hairColour: 'black',
        ageRange: '36-45',
        build: 'full',
        gender: 'masculine',
        baseImg: '/models/male_base.jpg',
        description: 'Full-bodied, strong silhouette.',
    },
    {
        name: 'Yui',
        heightCm: 158,
        bustCm: 80,
        waistCm: 62,
        hipsCm: 88,
        shoulderCm: 36,
        inseamCm: 70,
        skinTone: '#E8C9A0',
        skinToneName: 'Light Neutral',
        hairColour: 'black',
        ageRange: '18-25',
        build: 'slim',
        gender: 'feminine',
        baseImg: '/models/female_base.jpg',
        description: 'Petite frame, precise tailored proportions.',
    },
    {
        name: 'Ibrahim',
        heightCm: 182,
        bustCm: 108,
        waistCm: 92,
        hipsCm: 107,
        shoulderCm: 47,
        inseamCm: 82,
        skinTone: '#8B5A2B',
        skinToneName: 'Warm Sienna',
        hairColour: 'black',
        ageRange: '36-45',
        build: 'full',
        gender: 'masculine',
        baseImg: '/models/male_base.jpg',
        description: 'Generous build with commanding presence.',
    },
    {
        name: 'Zara',
        heightCm: 172,
        bustCm: 100,
        waistCm: 80,
        hipsCm: 108,
        shoulderCm: 40,
        inseamCm: 77,
        skinTone: '#B5724A',
        skinToneName: 'Medium Brown',
        hairColour: 'black',
        ageRange: '26-35',
        build: 'plus',
        gender: 'feminine',
        baseImg: '/models/dress_fitted.jpg',
        description: 'Curves and confidence, full-figure proportions.',
    },
    {
        name: 'Alex',
        heightCm: 175,
        bustCm: 90,
        waistCm: 73,
        hipsCm: 94,
        shoulderCm: 42,
        inseamCm: 79,
        skinTone: '#D4A574',
        skinToneName: 'Warm Caramel',
        hairColour: 'brown',
        ageRange: '26-35',
        build: 'average',
        gender: 'androgynous',
        baseImg: '/models/issey_pleats_fitted.jpg',
        description: 'Balanced androgynous proportions, versatile silhouette.',
    },
];
const BRANDS = [
    {
        id: 'homme-plisse',
        name: 'Homme Plissé Issey Miyake',
        website: 'https://www.isseymiyake.com',
    },
    { id: 'agabagbo', name: 'Agabagbo Lagos' },
    { id: 'asa-studio', name: 'Asa Studio' },
    { id: 'iroko-atelier', name: 'Iroko Atelier' },
    { id: 'maison-noir', name: 'Maison Noir' },
];
const GARMENTS = [
    {
        brandId: 'homme-plisse',
        name: 'Pleated Crewneck & Wide-Leg Trousers',
        description: 'Iconic micro-pleated technical fabric with sculptural drape and natural fold memory.',
        price: 240000,
        currency: 'NGN',
        category: 'Tops',
        images: ['/garments/issey_top.png'],
        colors: [
            { name: 'Ice Blue', hex: '#A2C4D9' },
            { name: 'White', hex: '#F5F5F0' },
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fit: 'relaxed',
        material: '100% Pleated Polyester',
        stretch: 'medium',
        garmentMeasurements: { bustCm: 100, shoulderCm: 46, lengthCm: 68 },
        fittedImg: '/models/issey_pleats_fitted.jpg',
    },
    {
        brandId: 'agabagbo',
        name: 'Oversized Tailored Linen Suit',
        description: 'Double-breasted unstructured linen blazer paired with wide pleated trousers.',
        price: 145000,
        currency: 'NGN',
        category: 'Outerwear',
        images: [
            'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500&h=650&fit=crop&auto=format&q=85',
        ],
        colors: [{ name: 'Natural', hex: '#E5DDD0' }],
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        fit: 'oversized',
        material: '100% Raw Nigerian Linen',
        stretch: 'none',
        garmentMeasurements: { bustCm: 110, shoulderCm: 50, lengthCm: 80 },
        fittedImg: '/models/blazer_fitted.jpg',
    },
    {
        brandId: 'asa-studio',
        name: 'Asymmetric Draped Silk Gown',
        description: 'One-shoulder sculptural evening dress in metallic-sheen molten silk.',
        price: 120000,
        currency: 'NGN',
        category: 'Dresses',
        images: [
            'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&h=650&fit=crop&auto=format&q=85',
        ],
        colors: [{ name: 'Bronze', hex: '#8B6F47' }],
        sizes: ['XS', 'S', 'M', 'L'],
        fit: 'slim',
        material: '100% Mulberry Silk Charmeuse',
        stretch: 'low',
        garmentMeasurements: { bustCm: 88, waistCm: 70, hipsCm: 96, lengthCm: 140 },
        fittedImg: '/models/dress_fitted.jpg',
    },
    {
        brandId: 'homme-plisse',
        name: 'Sculptural Zip Blouson',
        description: 'High-neck pleated technical zip jacket with articulated raglan sleeve contours.',
        price: 310000,
        currency: 'NGN',
        category: 'Outerwear',
        images: ['/garments/issey_jacket.png'],
        colors: [
            { name: 'Chalk', hex: '#DCDAD6' },
            { name: 'Oxide', hex: '#A64B38' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        fit: 'regular',
        material: 'Engineered Micro-Pleat',
        stretch: 'medium',
        garmentMeasurements: { bustCm: 102, shoulderCm: 46, lengthCm: 62 },
        fittedImg: '/models/issey_pleats_fitted.jpg',
    },
    {
        brandId: 'agabagbo',
        name: 'Structured Cotton Poplin Shirt',
        description: 'Crisp Oxford poplin with extended collar points and mother of pearl buttons.',
        price: 38000,
        currency: 'NGN',
        category: 'Tops',
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&h=650&fit=crop&auto=format&q=85',
        ],
        colors: [
            { name: 'Ivory', hex: '#F5F0E8' },
            { name: 'Ink', hex: '#161616' },
        ],
        sizes: ['S', 'M', 'L', 'XL'],
        fit: 'regular',
        material: '100% Giza Cotton',
        stretch: 'none',
        garmentMeasurements: { bustCm: 98, shoulderCm: 44, lengthCm: 74 },
        fittedImg: '/models/male_base.jpg',
    },
    {
        brandId: 'iroko-atelier',
        name: 'Ivory Minimalist Tailored Set',
        description: 'Sleek sleeveless top and pressed-crease cigarette trousers in wool-silk blend.',
        price: 85000,
        currency: 'NGN',
        category: 'Trousers',
        images: [
            'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500&h=650&fit=crop&auto=format&q=85',
        ],
        colors: [{ name: 'Ivory', hex: '#F4F1EA' }],
        sizes: ['XS', 'S', 'M', 'L'],
        fit: 'slim',
        material: 'Wool-Silk Blend',
        stretch: 'none',
        garmentMeasurements: { waistCm: 72, hipsCm: 94, inseamCm: 76, riseCm: 28 },
        fittedImg: '/models/female_base.jpg',
    },
    {
        brandId: 'agabagbo',
        name: 'Modern Biker Leather Jacket',
        description: 'Supple full-grain calfskin leather jacket with asymmetrical silver hardware.',
        price: 195000,
        currency: 'NGN',
        category: 'Outerwear',
        images: [
            'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=650&fit=crop&auto=format&q=85',
        ],
        colors: [{ name: 'Jet Black', hex: '#111111' }],
        sizes: ['S', 'M', 'L', 'XL'],
        fit: 'slim',
        material: '100% Full-Grain Calfskin',
        stretch: 'none',
        garmentMeasurements: { bustCm: 96, shoulderCm: 44, lengthCm: 56 },
        fittedImg: '/models/blazer_fitted.jpg',
    },
    {
        brandId: 'iroko-atelier',
        name: 'Washed Wide-Leg Jeans',
        description: 'Vintage-washed indigo denim with generous thigh and relaxed ankle.',
        price: 65000,
        currency: 'NGN',
        category: 'Jeans',
        images: [
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=650&fit=crop&auto=format&q=85',
        ],
        colors: [
            { name: 'Indigo', hex: '#3B4F72' },
            { name: 'Washed Black', hex: '#2A2A2A' },
        ],
        sizes: ['XS', 'S', 'M', 'L', 'XL'],
        fit: 'relaxed',
        material: '98% Cotton 2% Elastane',
        stretch: 'low',
        garmentMeasurements: { waistCm: 76, hipsCm: 100, inseamCm: 78, riseCm: 30 },
        fittedImg: '/models/female_base.jpg',
    },
];
async function main() {
    console.log('🧵 Seeding Gúnrégé database...\n');
    for (const brand of BRANDS) {
        await prisma.brand.upsert({
            where: { id: brand.id },
            update: {},
            create: brand,
        });
        console.log(`  ✓ Brand: ${brand.name}`);
    }
    for (const model of MODEL_PRESETS) {
        await prisma.modelPreset.upsert({
            where: { id: model.name.toLowerCase() },
            update: {},
            create: { id: model.name.toLowerCase(), ...model },
        });
        console.log(`  ✓ Model: ${model.name} (${model.build}, ${model.gender})`);
    }
    for (const garment of GARMENTS) {
        const id = garment.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        await prisma.garment.upsert({
            where: { id },
            update: {},
            create: {
                id,
                ...garment,
                colors: garment.colors,
                garmentMeasurements: garment.garmentMeasurements,
            },
        });
        console.log(`  ✓ Garment: ${garment.name}`);
    }
    await prisma.user.upsert({
        where: { email: 'guest@gunrege.local' },
        update: {},
        create: {
            email: 'guest@gunrege.local',
            name: 'Guest',
        },
    });
    console.log('  ✓ Guest user');
    console.log('\n🧵 Seed complete!');
}
main()
    .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map