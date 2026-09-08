-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "unit" TEXT NOT NULL DEFAULT 'metric',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bodyShape" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BodyProfile" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "heightCm" DOUBLE PRECISION NOT NULL,
    "bustCm" DOUBLE PRECISION NOT NULL,
    "waistCm" DOUBLE PRECISION NOT NULL,
    "hipsCm" DOUBLE PRECISION NOT NULL,
    "shoulderCm" DOUBLE PRECISION,
    "inseamCm" DOUBLE PRECISION,
    "weightKg" DOUBLE PRECISION,

    CONSTRAINT "BodyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppearanceProfile" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "skinTone" TEXT NOT NULL,
    "skinToneName" TEXT NOT NULL,
    "hairColour" TEXT NOT NULL,
    "ageRange" TEXT NOT NULL,
    "build" TEXT NOT NULL,

    CONSTRAINT "AppearanceProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModelPreset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "heightCm" DOUBLE PRECISION NOT NULL,
    "bustCm" DOUBLE PRECISION NOT NULL,
    "waistCm" DOUBLE PRECISION NOT NULL,
    "hipsCm" DOUBLE PRECISION NOT NULL,
    "shoulderCm" DOUBLE PRECISION NOT NULL,
    "inseamCm" DOUBLE PRECISION NOT NULL,
    "skinTone" TEXT NOT NULL,
    "skinToneName" TEXT NOT NULL,
    "hairColour" TEXT NOT NULL,
    "ageRange" TEXT NOT NULL,
    "build" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "baseImg" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModelPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VirtualLikeness" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matchedModelId" TEXT NOT NULL,
    "matchDistance" DOUBLE PRECISION NOT NULL,
    "matchConfidenceTier" TEXT NOT NULL,
    "heightCm" DOUBLE PRECISION NOT NULL,
    "bustCm" DOUBLE PRECISION NOT NULL,
    "waistCm" DOUBLE PRECISION NOT NULL,
    "hipsCm" DOUBLE PRECISION NOT NULL,
    "shoulderCm" DOUBLE PRECISION,
    "inseamCm" DOUBLE PRECISION,
    "skinTone" TEXT NOT NULL,
    "hairColour" TEXT NOT NULL,
    "ageRange" TEXT NOT NULL,
    "build" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VirtualLikeness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT,
    "website" TEXT,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Garment" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "category" TEXT NOT NULL,
    "images" TEXT[],
    "colors" JSONB NOT NULL,
    "sizes" TEXT[],
    "fit" TEXT NOT NULL,
    "material" TEXT NOT NULL,
    "stretch" TEXT NOT NULL,
    "garmentMeasurements" JSONB NOT NULL,
    "purchaseUrl" TEXT,
    "fittedImg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Garment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TryOn" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "likenessId" TEXT NOT NULL,
    "garmentId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "resultUrl" TEXT,
    "inputSignature" TEXT NOT NULL,
    "error" TEXT,
    "provider" TEXT,
    "providerModel" TEXT,
    "latencyMs" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "TryOn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FitAnalysis" (
    "id" TEXT NOT NULL,
    "tryOnId" TEXT NOT NULL,
    "labels" JSONB NOT NULL,
    "matchConfidenceTier" TEXT NOT NULL,
    "qualifiedMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FitAnalysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Look" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "likenessId" TEXT NOT NULL,
    "garmentId" TEXT NOT NULL,
    "tryOnId" TEXT,
    "resultImg" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Look_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BodyProfile_profileId_key" ON "BodyProfile"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "AppearanceProfile_profileId_key" ON "AppearanceProfile"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "VirtualLikeness_userId_key" ON "VirtualLikeness"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TryOn_inputSignature_key" ON "TryOn"("inputSignature");

-- CreateIndex
CREATE UNIQUE INDEX "FitAnalysis_tryOnId_key" ON "FitAnalysis"("tryOnId");

-- CreateIndex
CREATE UNIQUE INDEX "Look_likenessId_garmentId_key" ON "Look"("likenessId", "garmentId");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BodyProfile" ADD CONSTRAINT "BodyProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppearanceProfile" ADD CONSTRAINT "AppearanceProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualLikeness" ADD CONSTRAINT "VirtualLikeness_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VirtualLikeness" ADD CONSTRAINT "VirtualLikeness_matchedModelId_fkey" FOREIGN KEY ("matchedModelId") REFERENCES "ModelPreset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Garment" ADD CONSTRAINT "Garment_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TryOn" ADD CONSTRAINT "TryOn_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TryOn" ADD CONSTRAINT "TryOn_likenessId_fkey" FOREIGN KEY ("likenessId") REFERENCES "VirtualLikeness"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TryOn" ADD CONSTRAINT "TryOn_garmentId_fkey" FOREIGN KEY ("garmentId") REFERENCES "Garment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FitAnalysis" ADD CONSTRAINT "FitAnalysis_tryOnId_fkey" FOREIGN KEY ("tryOnId") REFERENCES "TryOn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Look" ADD CONSTRAINT "Look_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Look" ADD CONSTRAINT "Look_likenessId_fkey" FOREIGN KEY ("likenessId") REFERENCES "VirtualLikeness"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Look" ADD CONSTRAINT "Look_garmentId_fkey" FOREIGN KEY ("garmentId") REFERENCES "Garment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Look" ADD CONSTRAINT "Look_tryOnId_fkey" FOREIGN KEY ("tryOnId") REFERENCES "TryOn"("id") ON DELETE SET NULL ON UPDATE CASCADE;
