const Placement = require("../server/models/Placement");
const User = require("../server/models/User");

module.exports = async () => {
  try {
    await Placement.deleteMany();
    console.log("🗑️ Cleared existing placement records");

    const studentUsers = await User.find({ role: "student" });

    if (studentUsers.length === 0) {
      throw new Error("No students found. Please seed users first.");
    }

    const companies = [
      {
        name: "TechCorp Solutions",
        location: "Bangalore, Karnataka",
        industry: "Technology",
        package: "₹8,00,000 - ₹12,00,000",
        description: "Leading software development company specializing in AI and ML solutions"
      },
      {
        name: "DataFlow Analytics",
        location: "Mumbai, Maharashtra",
        industry: "Data Science",
        package: "₹6,50,000 - ₹10,00,000",
        description: "Data analytics and business intelligence company"
      },
      {
        name: "InnovateTech Systems",
        location: "Hyderabad, Telangana",
        industry: "Technology",
        package: "₹7,50,000 - ₹11,00,000",
        description: "Innovative technology solutions for enterprise clients"
      },
      {
        name: "AI Solutions Ltd",
        location: "Pune, Maharashtra",
        industry: "Artificial Intelligence",
        package: "₹9,00,000 - ₹15,00,000",
        description: "Cutting-edge AI and machine learning company"
      },
      {
        name: "CloudTech Services",
        location: "Chennai, Tamil Nadu",
        industry: "Cloud Computing",
        package: "₹6,00,000 - ₹9,50,000",
        description: "Cloud infrastructure and DevOps services"
      }
    ];

    const jobRoles = [
      "Software Engineer",
      "Data Scientist",
      "Machine Learning Engineer",
      "Full Stack Developer",
      "DevOps Engineer",
      "AI Research Engineer",
      "Data Analyst",
      "Backend Developer",
      "Frontend Developer",
      "Product Manager"
    ];

    const placementRecords = [
      {
        student: studentUsers[0]._id, // Arjun Mehta
        company: companies[0].name,
        role: jobRoles[0], // Software Engineer
        package: "₹10,00,000",
        location: companies[0].location,
        status: "placed",
        placementDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        interviewDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35 days ago
        offerLetter: "OL-2024-001",
        remarks: "Excellent technical skills and problem-solving abilities",
        companyDetails: companies[0]
      },
      {
        student: studentUsers[1]._id, // Zara Khan
        company: companies[1].name,
        role: jobRoles[1], // Data Scientist
        package: "₹8,50,000",
        location: companies[1].location,
        status: "placed",
        placementDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
        interviewDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        offerLetter: "OL-2024-002",
        remarks: "Strong analytical skills and domain knowledge",
        companyDetails: companies[1]
      },
      {
        student: studentUsers[2]._id, // Rahul Verma
        company: companies[3].name,
        role: jobRoles[2], // Machine Learning Engineer
        package: "₹12,00,000",
        location: companies[3].location,
        status: "placed",
        placementDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
        interviewDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25 days ago
        offerLetter: "OL-2024-003",
        remarks: "Outstanding ML project portfolio and technical expertise",
        companyDetails: companies[3]
      },
      {
        student: studentUsers[3]._id, // Ananya Desai
        company: companies[2].name,
        role: jobRoles[3], // Full Stack Developer
        package: "₹9,00,000",
        location: companies[2].location,
        status: "interview_scheduled",
        placementDate: null,
        interviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        offerLetter: null,
        remarks: "Shortlisted for final round interview",
        companyDetails: companies[2]
      },
      {
        student: studentUsers[4]._id, // Vikram Joshi
        company: companies[4].name,
        role: jobRoles[4], // DevOps Engineer
        package: "₹7,50,000",
        location: companies[4].location,
        status: "applied",
        placementDate: null,
        interviewDate: null,
        offerLetter: null,
        remarks: "Application under review",
        companyDetails: companies[4]
      }
    ];

    // Add some additional placement opportunities
    const placementOpportunities = [
      {
        company: "FutureTech Innovations",
        role: "AI Engineer",
        package: "₹11,00,000 - ₹16,00,000",
        location: "Bangalore, Karnataka",
        requirements: "Strong Python, TensorFlow, PyTorch skills",
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        status: "active",
        description: "Join our AI team to build next-generation intelligent systems"
      },
      {
        company: "DataViz Solutions",
        role: "Data Visualization Specialist",
        package: "₹6,00,000 - ₹9,00,000",
        location: "Mumbai, Maharashtra",
        requirements: "Tableau, Power BI, D3.js experience",
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        status: "active",
        description: "Create compelling data visualizations for enterprise clients"
      },
      {
        company: "CyberSec Pro",
        role: "Security Engineer",
        package: "₹8,00,000 - ₹12,00,000",
        location: "Delhi, NCR",
        requirements: "Cybersecurity, ethical hacking, network security",
        deadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        status: "active",
        description: "Protect digital assets and infrastructure from cyber threats"
      }
    ];

    await Placement.insertMany(placementRecords);
    console.log("✅ Seeded placement records successfully");
    console.log(`📊 Created ${placementRecords.length} placement records:`);
    
    const placedCount = placementRecords.filter(p => p.status === 'placed').length;
    const interviewCount = placementRecords.filter(p => p.status === 'interview_scheduled').length;
    const appliedCount = placementRecords.filter(p => p.status === 'applied').length;
    
    console.log(`   - Placed: ${placedCount} students`);
    console.log(`   - Interview Scheduled: ${interviewCount} students`);
    console.log(`   - Applied: ${appliedCount} students`);
    console.log(`   - Placement Rate: ${((placedCount / studentUsers.length) * 100).toFixed(1)}%`);
    
    return { placementRecords, placementOpportunities };
  } catch (error) {
    console.error("❌ Error seeding placement:", error);
    throw error;
  }
}; 