const Course = require("../server/models/Course");
const User = require("../server/models/User");

module.exports = async () => {
  try {
    await Course.deleteMany();
    console.log("🗑️ Cleared existing courses");

    // Get faculty users for course assignment
    const facultyUsers = await User.find({ role: "faculty" });
    const studentUsers = await User.find({ role: "student" });

    if (facultyUsers.length === 0) {
      throw new Error("No faculty users found. Please seed users first.");
    }

    const courses = [
      {
        title: "Data Structures and Algorithms",
        code: "CS201",
        description: "Fundamental data structures and algorithmic techniques for problem solving",
        faculty: facultyUsers[0]._id, // Dr. Amit Patel
        department: "Computer Science",
        credits: 4,
        semester: 3,
        maxStudents: 60,
        enrolledStudents: studentUsers.slice(0, 3).map(s => s._id), // First 3 students
        schedule: {
          day: "Monday",
          time: "10:00 AM - 11:30 AM",
          room: "Lab 101"
        },
        syllabus: [
          "Arrays and Linked Lists",
          "Stacks and Queues",
          "Trees and Graphs",
          "Sorting Algorithms",
          "Search Algorithms"
        ],
        assignments: [
          {
            title: "Implement Binary Search Tree",
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            weight: 20
          },
          {
            title: "Graph Traversal Algorithms",
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            weight: 25
          }
        ]
      },
      {
        title: "Machine Learning Fundamentals",
        code: "ML301",
        description: "Introduction to machine learning algorithms and applications",
        faculty: facultyUsers[3]._id, // Prof. Meera Singh
        department: "Machine Learning",
        credits: 3,
        semester: 5,
        maxStudents: 45,
        enrolledStudents: studentUsers.slice(2, 5).map(s => s._id), // Students 3-5
        schedule: {
          day: "Tuesday",
          time: "2:00 PM - 3:30 PM",
          room: "Lab 203"
        },
        syllabus: [
          "Supervised Learning",
          "Unsupervised Learning",
          "Neural Networks",
          "Deep Learning Basics",
          "Model Evaluation"
        ],
        assignments: [
          {
            title: "Linear Regression Implementation",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            weight: 15
          },
          {
            title: "Neural Network Project",
            dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
            weight: 30
          }
        ]
      },
      {
        title: "Database Management Systems",
        code: "CS210",
        description: "Design and implementation of database systems",
        faculty: facultyUsers[0]._id, // Dr. Amit Patel
        department: "Computer Science",
        credits: 4,
        semester: 4,
        maxStudents: 50,
        enrolledStudents: studentUsers.slice(0, 2).map(s => s._id), // First 2 students
        schedule: {
          day: "Wednesday",
          time: "11:00 AM - 12:30 PM",
          room: "Lab 102"
        },
        syllabus: [
          "Relational Database Design",
          "SQL Programming",
          "Normalization",
          "Transaction Management",
          "Database Security"
        ],
        assignments: [
          {
            title: "Database Design Project",
            dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            weight: 25
          },
          {
            title: "SQL Implementation",
            dueDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
            weight: 20
          }
        ]
      },
      {
        title: "Artificial Intelligence",
        code: "AI401",
        description: "Advanced AI concepts and intelligent systems",
        faculty: facultyUsers[2]._id, // Dr. Karthik Iyer
        department: "Artificial Intelligence",
        credits: 3,
        semester: 6,
        maxStudents: 40,
        enrolledStudents: studentUsers.slice(1, 4).map(s => s._id), // Students 2-4
        schedule: {
          day: "Thursday",
          time: "3:00 PM - 4:30 PM",
          room: "Lab 301"
        },
        syllabus: [
          "Search Algorithms",
          "Knowledge Representation",
          "Expert Systems",
          "Natural Language Processing",
          "Computer Vision"
        ],
        assignments: [
          {
            title: "AI Agent Development",
            dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
            weight: 20
          },
          {
            title: "NLP Project",
            dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            weight: 25
          }
        ]
      },
      {
        title: "Data Science with Python",
        code: "DS201",
        description: "Data analysis and visualization using Python",
        faculty: facultyUsers[1]._id, // Prof. Sneha Reddy
        department: "Data Science",
        credits: 3,
        semester: 2,
        maxStudents: 55,
        enrolledStudents: studentUsers.slice(3, 5).map(s => s._id), // Last 2 students
        schedule: {
          day: "Friday",
          time: "1:00 PM - 2:30 PM",
          room: "Lab 202"
        },
        syllabus: [
          "Python for Data Science",
          "Pandas and NumPy",
          "Data Visualization",
          "Statistical Analysis",
          "Data Cleaning"
        ],
        assignments: [
          {
            title: "Data Analysis Project",
            dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
            weight: 20
          },
          {
            title: "Visualization Dashboard",
            dueDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
            weight: 25
          }
        ]
      }
    ];

    await Course.insertMany(courses);
    console.log("✅ Seeded courses successfully");
    console.log(`📊 Created ${courses.length} courses:`);
    courses.forEach(course => {
      console.log(`   - ${course.code}: ${course.title} (${course.enrolledStudents.length} students enrolled)`);
    });
    
    return courses;
  } catch (error) {
    console.error("❌ Error seeding courses:", error);
    throw error;
  }
}; 