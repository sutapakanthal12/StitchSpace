const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Workshop = require("./models/Workshop");
const Product = require("./models/Product");

dotenv.config();

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Workshop.deleteMany({});
    await Product.deleteMany({});
    console.log("Cleared existing data");

    // Create sample artisans
    const artisans = await User.create([
      {
        name: "Priya Sharma",
        email: "priya@stitchspace.com",
        password: "password123",
        role: "artisan",
        bio: "Expert weaver with 15 years of experience",
        profileImage: "https://via.placeholder.com/150?text=Priya",
      },
      {
        name: "Raj Kumar",
        email: "raj@stitchspace.com",
        password: "password123",
        role: "artisan",
        bio: "Master embroiderer and traditional craftsman",
        profileImage: "https://via.placeholder.com/150?text=Raj",
      },
      {
        name: "Meera Desai",
        email: "meera@stitchspace.com",
        password: "password123",
        role: "artisan",
        bio: "Natural dye specialist and sustainable fashion advocate",
        profileImage: "https://via.placeholder.com/150?text=Meera",
      },
    ]);
    console.log("Created artisans");

    // Create sample workshops
    const workshops = await Workshop.create([
      {
        title: "Beginner Embroidery Basics",
        description:
          "Learn the fundamental embroidery techniques including cross stitch, backstitch, and French knots. Perfect for beginners!",
        artisan: artisans[1]._id,
        category: "Embroidery",
        price: 499,
        duration: "4 weeks",
        level: "Beginner",
        maxParticipants: 20,
        currentParticipants: 8,
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-02-28"),
        schedule: "Every Saturday 10 AM - 12 PM",
        materials: [
          "Embroidery hoop",
          "Embroidery threads",
          "Fabric",
          "Needles",
        ],
        images: ["https://via.placeholder.com/300x200?text=Embroidery"],
        learningOutcomes: [
          "Master basic embroidery stitches",
          "Design simple patterns",
          "Create a finished embroidered piece",
        ],
      },
      {
        title: "Advanced Weaving Techniques",
        description:
          "Explore complex weaving patterns and traditional techniques on the loom. For experienced weavers.",
        artisan: artisans[0]._id,
        category: "Weaving",
        price: 799,
        duration: "6 weeks",
        level: "Advanced",
        maxParticipants: 15,
        currentParticipants: 12,
        startDate: new Date("2024-02-15"),
        endDate: new Date("2024-03-31"),
        schedule: "Tuesday & Thursday 2 PM - 5 PM",
        materials: ["Loom", "Yarns", "Shuttles", "Tools"],
        images: ["https://via.placeholder.com/300x200?text=Weaving"],
        learningOutcomes: [
          "Master complex weaving patterns",
          "Understand traditional techniques",
          "Create large-scale weaving projects",
        ],
      },
      {
        title: "Natural Dye Workshop",
        description:
          "Learn to create beautiful colors using natural dyes from plants, flowers, and vegetables.",
        artisan: artisans[2]._id,
        category: "Dyeing",
        price: 599,
        duration: "3 weeks",
        level: "Beginner",
        maxParticipants: 25,
        currentParticipants: 18,
        startDate: new Date("2024-02-10"),
        endDate: new Date("2024-02-28"),
        schedule: "Wednesday 6 PM - 8 PM",
        materials: ["Fabric", "Natural dyes", "Mordants", "Pots", "Equipment"],
        images: ["https://via.placeholder.com/300x200?text=Natural+Dye"],
        learningOutcomes: [
          "Extract dyes from natural sources",
          "Prepare fabric for dyeing",
          "Create unique color variations",
        ],
      },
      {
        title: "Intermediate Knitting",
        description:
          "Level up your knitting skills with intermediate patterns and techniques for beautiful garments.",
        artisan: artisans[0]._id,
        category: "Knitting",
        price: 649,
        duration: "5 weeks",
        level: "Intermediate",
        maxParticipants: 20,
        currentParticipants: 10,
        startDate: new Date("2024-02-05"),
        endDate: new Date("2024-03-12"),
        schedule: "Monday & Friday 4 PM - 6 PM",
        materials: [
          "Knitting needles",
          "Yarn",
          "Stitch markers",
          "Measuring tape",
        ],
        images: ["https://via.placeholder.com/300x200?text=Knitting"],
        learningOutcomes: [
          "Master intermediate knitting patterns",
          "Increase knitting speed",
          "Create wearable garments",
        ],
      },
      {
        title: "Beginner Stitching Essentials",
        description:
          "Start your stitching journey with hand and machine stitching basics. No prior experience needed!",
        artisan: artisans[1]._id,
        category: "Stitching",
        price: 399,
        duration: "3 weeks",
        level: "Beginner",
        maxParticipants: 30,
        currentParticipants: 22,
        startDate: new Date("2024-02-12"),
        endDate: new Date("2024-02-26"),
        schedule: "Saturday 1 PM - 3 PM",
        materials: [
          "Sewing machine",
          "Thread",
          "Fabric",
          "Scissors",
          "Needles",
        ],
        images: ["https://via.placeholder.com/300x200?text=Stitching"],
        learningOutcomes: [
          "Learn basic hand stitches",
          "Operate a sewing machine",
          "Create simple clothing items",
        ],
      },
      {
        title: "Weaving for Beginners",
        description:
          "Introduction to weaving on simple looms. Create beautiful woven pieces from day one!",
        artisan: artisans[0]._id,
        category: "Weaving",
        price: 549,
        duration: "4 weeks",
        level: "Beginner",
        maxParticipants: 20,
        currentParticipants: 15,
        startDate: new Date("2024-02-08"),
        endDate: new Date("2024-03-07"),
        schedule: "Thursday 3 PM - 5 PM",
        materials: ["Simple loom", "Yarns", "Shuttle", "Weaving tools"],
        images: ["https://via.placeholder.com/300x200?text=Beginner+Weaving"],
        learningOutcomes: [
          "Understand basic weaving concepts",
          "Use simple looms effectively",
          "Complete small weaving projects",
        ],
      },
    ]);
    console.log("Created workshops");

    // Create sample products
    const products = await Product.create([
      {
        name: "Hand-woven Scarf",
        description: "Beautiful hand-woven scarf made with natural fibers",
        artist: artisans[0]._id,
        category: "Textiles",
        price: 1299,
        images: ["https://via.placeholder.com/300x200?text=Woven+Scarf"],
        fairTradeCertified: true,
        ecoFriendly: true,
        quantity: 10,
        reviews: [],
      },
      {
        name: "Embroidered Cushion Cover",
        description:
          "Hand-embroidered cushion cover with traditional Indian motifs",
        artist: artisans[1]._id,
        category: "Home Decor",
        price: 899,
        images: [
          "https://via.placeholder.com/300x200?text=Embroidered+Cushion",
        ],
        fairTradeCertified: true,
        ecoFriendly: true,
        quantity: 8,
        reviews: [],
      },
      {
        name: "Natural Dyed Fabric",
        description: "Premium fabric dyed with 100% natural plant-based dyes",
        artist: artisans[2]._id,
        category: "Textiles",
        price: 599,
        images: [
          "https://via.placeholder.com/300x200?text=Natural+Dyed+Fabric",
        ],
        fairTradeCertified: true,
        ecoFriendly: true,
        quantity: 15,
        reviews: [],
      },
      {
        name: "Knitted Blanket",
        description: "Cozy hand-knitted blanket in soft wool",
        artist: artisans[0]._id,
        category: "Textiles",
        price: 2499,
        images: ["https://via.placeholder.com/300x200?text=Knitted+Blanket"],
        fairTradeCertified: true,
        ecoFriendly: true,
        quantity: 5,
        reviews: [],
      },
      {
        name: "Handmade Clutch",
        description: "Elegant clutch with hand-stitched details",
        artist: artisans[1]._id,
        category: "Accessories",
        price: 749,
        images: ["https://via.placeholder.com/300x200?text=Handmade+Clutch"],
        fairTradeCertified: true,
        ecoFriendly: false,
        quantity: 12,
        reviews: [],
      },
    ]);
    console.log("Created products");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
