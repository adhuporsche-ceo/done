// 1. Select Database
use collegeDB

// 2. Create Collection
db.createCollection("students")

// 3. Insert One Record
db.students.insertOne({
  name: "Adhi",
  rollNo: "403",
  department: "CSE",
  semester: 5
})

// 4. Insert Multiple Records
db.students.insertMany([
  { name: "Arun", department: "CSE", semester: 5 },
  { name: "Priya", department: "IT", semester: 5 }
])

// 5. Display All Records
db.students.find()

// 6. Find One Record
db.students.findOne({ rollNo: "403" })

// 7. Find Records by Condition
db.students.find({ department: "CSE" })

// 8. Find Records Greater Than a Value
db.students.find({ semester: { $gt: 4 } })

// 9. Display Selected Fields
db.students.find({}, { name: 1, department: 1, _id: 0 })

// 10. Update One Record
db.students.updateOne(
  { rollNo: "403" },
  { $set: { semester: 6 } }
)

// 11. Update Multiple Records
db.students.updateMany(
  { department: "CSE" },
  { $set: { semester: 6 } }
)

// 12. Delete One Record
db.students.deleteOne({ rollNo: "403" })

// 13. Delete Multiple Records
db.students.deleteMany({ department: "IT" })

// 14. Count Records
db.students.countDocuments()

// 15. Sort Records (Ascending)
db.students.find().sort({ name: 1 })

// 16. Sort Records (Descending)
db.students.find().sort({ name: -1 })

// 17. Limit Results
db.students.find().limit(5)

// 18. Find by ID
db.students.findOne({ _id: ObjectId("YOUR_OBJECT_ID") })

// 19. Delete All Records — Use Carefully
db.students.deleteMany({})