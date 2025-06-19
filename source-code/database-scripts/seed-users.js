const User = require("../server/models/User");
const bcrypt = require("bcryptjs");

module.exports = async () => {
  try {
    await User.deleteMany();  // Clear old users
    const hashedPassword = await bcrypt.hash("password123", 10);
    await User.insertMany([
      {
        name: "Dr. Rajesh Kumar",
        email: "admin@evidyasaathi.edu",
        password: hashedPassword,
        role: "admin",
        avatar: "",
        department: "Administration",
        phone: "+91-9876543210",
        address: "E-Vidya Saathi Campus, Tech Hub, Bangalore"
      },
      {
        name: "Prof. Priya Sharma",
        email: "admin2@evidyasaathi.edu",
        password: hashedPassword,
        role: "admin",
        avatar: "",
        department: "Student Affairs",
        phone: "+91-9876543211",
        address: "E-Vidya Saathi Campus, Tech Hub, Bangalore"
      },
      {
        name: "Dr. Amit Patel",
        email: "faculty@evidyasaathi.edu",
        password: hashedPassword,
        role: "faculty",
        avatar: "",
        department: "Computer Science",
        phone: "+91-9876543212",
        address: "Faculty Quarters, E-Vidya Saathi Campus"
      },
      {
        name: "Prof. Sneha Reddy",
        email: "faculty2@evidyasaathi.edu",
        password: hashedPassword,
        role: "faculty",
        avatar: "",
        department: "Data Science",
        phone: "+91-9876543213",
        address: "Faculty Quarters, E-Vidya Saathi Campus"
      },
      {
        name: "Dr. Karthik Iyer",
        email: "faculty3@evidyasaathi.edu",
        password: hashedPassword,
        role: "faculty",
        avatar: "",
        department: "Artificial Intelligence",
        phone: "+91-9876543214",
        address: "Faculty Quarters, E-Vidya Saathi Campus"
      },
      {
        name: "Prof. Meera Singh",
        email: "faculty4@evidyasaathi.edu",
        password: hashedPassword,
        role: "faculty",
        avatar: "",
        department: "Machine Learning",
        phone: "+91-9876543215",
        address: "Faculty Quarters, E-Vidya Saathi Campus"
      },
      {
        name: "Arjun Mehta",
        email: "student@evidyasaathi.edu",
        password: hashedPassword,
        role: "student",
        avatar: "",
        department: "Computer Science",
        phone: "+91-9876543216",
        address: "Student Hostel Block A, E-Vidya Saathi Campus",
        rollNumber: "CS2024001",
        semester: 4,
        cgpa: 8.5
      },
      {
        name: "Zara Khan",
        email: "student2@evidyasaathi.edu",
        password: hashedPassword,
        role: "student",
        avatar: "",
        department: "Data Science",
        phone: "+91-9876543217",
        address: "Student Hostel Block B, E-Vidya Saathi Campus",
        rollNumber: "DS2024002",
        semester: 3,
        cgpa: 8.8
      },
      {
        name: "Rahul Verma",
        email: "student3@evidyasaathi.edu",
        password: hashedPassword,
        role: "student",
        avatar: "",
        department: "Artificial Intelligence",
        phone: "+91-9876543218",
        address: "Student Hostel Block A, E-Vidya Saathi Campus",
        rollNumber: "AI2024003",
        semester: 5,
        cgpa: 7.9
      },
      {
        name: "Ananya Desai",
        email: "student4@evidyasaathi.edu",
        password: hashedPassword,
        role: "student",
        avatar: "",
        department: "Machine Learning",
        phone: "+91-9876543219",
        address: "Student Hostel Block C, E-Vidya Saathi Campus",
        rollNumber: "ML2024004",
        semester: 2,
        cgpa: 9.1
      },
      {
        name: "Vikram Joshi",
        email: "student5@evidyasaathi.edu",
        password: hashedPassword,
        role: "student",
        avatar: "",
        department: "Computer Science",
        phone: "+91-9876543220",
        address: "Student Hostel Block B, E-Vidya Saathi Campus",
        rollNumber: "CS2024005",
        semester: 6,
        cgpa: 8.2
      }
    ]);
    console.log("✅ Seeded users");
  } catch (err) {
    console.error("❌ Error seeding users:", err);
  }
}; 