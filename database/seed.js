/**
 * Seeds sample medicines so you can test OCR matching + token generation
 * without wiring up a real hospital inventory feed first.
 * Run: cd server && npm run seed
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", "server", ".env") });
const mongoose = require("mongoose");
const Medicine = require("../server/models/Medicine");

const sampleMedicines = [
  { name: "Paracetamol", genericName: "Acetaminophen", aliases: ["Crocin", "Dolo 650", "Calpol"], stockQuantity: 120, unit: "tablet", counterNumber: 1 },
  { name: "Amoxicillin", genericName: "Amoxicillin", aliases: ["Mox", "Amoxil"], stockQuantity: 0, unit: "capsule", counterNumber: 2 },
  { name: "Cetirizine", genericName: "Cetirizine Hydrochloride", aliases: ["Zyrtec", "Alerid"], stockQuantity: 45, unit: "tablet", counterNumber: 1 },
  { name: "Metformin", genericName: "Metformin Hydrochloride", aliases: ["Glucophage", "Glycomet"], stockQuantity: 80, unit: "tablet", counterNumber: 2 },
  { name: "Azithromycin", genericName: "Azithromycin", aliases: ["Azithral", "Zithromax"], stockQuantity: 5, unit: "tablet", counterNumber: 2 },
  { name: "Ibuprofen", genericName: "Ibuprofen", aliases: ["Brufen", "Advil"], stockQuantity: 60, unit: "tablet", counterNumber: 1 },
  { name: "Omeprazole", genericName: "Omeprazole", aliases: ["Prilosec", "Omez"], stockQuantity: 0, unit: "capsule", counterNumber: 3 },
  { name: "Cough Syrup", genericName: "Dextromethorphan", aliases: ["Benadryl", "Ascoril"], stockQuantity: 30, unit: "bottle", counterNumber: 3 },
];

async function seed() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/mediflow-ai";
  await mongoose.connect(uri);
  await Medicine.deleteMany({});
  await Medicine.insertMany(sampleMedicines);
  console.log(`Seeded ${sampleMedicines.length} medicines into ${uri}`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
