const Event = require("../server/models/Event");
const User = require("../server/models/User");

module.exports = async () => {
  try {
    await Event.deleteMany();
    console.log("🗑️ Cleared existing events");

    // Get users for event organization
    const adminUsers = await User.find({ role: "admin" });
    const facultyUsers = await User.find({ role: "faculty" });
    const studentUsers = await User.find({ role: "student" });

    if (adminUsers.length === 0) {
      throw new Error("No admin users found. Please seed users first.");
    }

    const events = [
      {
        title: "E-Vidya Saathi Tech Fest 2024",
        description: "Annual technology festival showcasing student projects and innovations in AI, ML, and Data Science",
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
        time: "10:00 AM - 6:00 PM",
        location: "E-Vidya Saathi Campus Auditorium",
        organizer: adminUsers[0]._id, // Dr. Rajesh Kumar
        category: "Technical",
        maxParticipants: 200,
        registeredParticipants: studentUsers.slice(0, 4).map(s => s._id), // First 4 students
        status: "upcoming",
        image: "",
        agenda: [
          "9:00 AM - Opening Ceremony",
          "10:00 AM - Project Showcase",
          "2:00 PM - Technical Talks",
          "4:00 PM - Networking Session",
          "6:00 PM - Closing & Awards"
        ],
        requirements: "Open to all students and faculty",
        prizes: "Cash prizes worth ₹50,000 for winning projects"
      },
      {
        title: "AI & ML Workshop Series",
        description: "Hands-on workshop on implementing machine learning algorithms and AI applications",
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
        time: "2:00 PM - 5:00 PM",
        location: "Lab 203, E-Vidya Saathi Campus",
        organizer: facultyUsers[2]._id, // Dr. Karthik Iyer
        category: "Workshop",
        maxParticipants: 30,
        registeredParticipants: studentUsers.slice(1, 3).map(s => s._id), // Students 2-3
        status: "upcoming",
        image: "",
        agenda: [
          "2:00 PM - Introduction to AI/ML",
          "2:30 PM - Hands-on Coding Session",
          "4:00 PM - Project Implementation",
          "5:00 PM - Q&A Session"
        ],
        requirements: "Basic Python knowledge required",
        prizes: "Certificates of completion"
      },
      {
        title: "Placement Preparation Seminar",
        description: "Comprehensive seminar on interview preparation, resume building, and career guidance",
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
        time: "11:00 AM - 1:00 PM",
        location: "Conference Hall, E-Vidya Saathi Campus",
        organizer: adminUsers[1]._id, // Prof. Priya Sharma
        category: "Career",
        maxParticipants: 100,
        registeredParticipants: studentUsers.map(s => s._id), // All students
        status: "upcoming",
        image: "",
        agenda: [
          "11:00 AM - Resume Building Tips",
          "11:30 AM - Interview Techniques",
          "12:00 PM - Industry Expert Talk",
          "12:30 PM - Mock Interview Session",
          "1:00 PM - Networking"
        ],
        requirements: "Open to final year students",
        prizes: "Free resume review session"
      },
      {
        title: "Data Science Hackathon",
        description: "24-hour hackathon focused on solving real-world problems using data science techniques",
        date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
        time: "9:00 AM - 9:00 AM (Next Day)",
        location: "Innovation Lab, E-Vidya Saathi Campus",
        organizer: facultyUsers[1]._id, // Prof. Sneha Reddy
        category: "Hackathon",
        maxParticipants: 50,
        registeredParticipants: studentUsers.slice(2, 5).map(s => s._id), // Students 3-5
        status: "upcoming",
        image: "",
        agenda: [
          "9:00 AM - Problem Statement Release",
          "10:00 AM - Team Formation",
          "12:00 PM - Coding Begins",
          "6:00 PM - Mid-review",
          "9:00 AM (Next Day) - Final Submission",
          "11:00 AM - Presentations & Judging"
        ],
        requirements: "Teams of 2-4 members, Laptop required",
        prizes: "₹25,000 for winning team, Internship opportunities"
      },
      {
        title: "Faculty Development Program",
        description: "Professional development workshop for faculty members on latest teaching methodologies",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        time: "10:00 AM - 4:00 PM",
        location: "Faculty Lounge, E-Vidya Saathi Campus",
        organizer: adminUsers[0]._id, // Dr. Rajesh Kumar
        category: "Professional Development",
        maxParticipants: 20,
        registeredParticipants: facultyUsers.map(f => f._id), // All faculty
        status: "upcoming",
        image: "",
        agenda: [
          "10:00 AM - Modern Teaching Methods",
          "11:30 AM - Technology Integration",
          "1:00 PM - Lunch Break",
          "2:00 PM - Assessment Strategies",
          "3:30 PM - Interactive Session"
        ],
        requirements: "Faculty members only",
        prizes: "Professional development certificates"
      },
      {
        title: "Alumni Meet 2024",
        description: "Annual gathering of E-Vidya Saathi alumni to network and share industry experiences",
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days from now
        time: "6:00 PM - 9:00 PM",
        location: "E-Vidya Saathi Campus Garden",
        organizer: adminUsers[1]._id, // Prof. Priya Sharma
        category: "Networking",
        maxParticipants: 150,
        registeredParticipants: [],
        status: "upcoming",
        image: "",
        agenda: [
          "6:00 PM - Welcome & Registration",
          "6:30 PM - Alumni Success Stories",
          "7:30 PM - Networking Session",
          "8:30 PM - Dinner & Socializing",
          "9:00 PM - Closing"
        ],
        requirements: "Alumni and current students welcome",
        prizes: "Networking opportunities"
      }
    ];

    await Event.insertMany(events);
    console.log("✅ Seeded events successfully");
    console.log(`📊 Created ${events.length} events:`);
    events.forEach(event => {
      console.log(`   - ${event.title} (${event.registeredParticipants.length} participants)`);
    });
    
    return events;
  } catch (error) {
    console.error("❌ Error seeding events:", error);
    throw error;
  }
}; 