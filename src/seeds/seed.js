require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Donor = require("../models/Donor");
const EmergencyRequest = require("../models/EmergencyRequest");

const donors = [
  {
    ownerUid: "seed-user-001",
    fullName: "Sarah Ahmed",
    bloodGroup: "O+",
    district: "Dhaka",
    phone: "+8801711000001",
    email: "sarah.ahmed@example.com",
    age: 28,
    gender: "Female",
    lastDonationDate: "2026-03-12",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    about: "Regular donor available for emergency requests around Dhaka.",
  },
  {
    ownerUid: "seed-user-002",
    fullName: "Tanvir Rahman",
    bloodGroup: "A+",
    district: "Chattogram",
    phone: "+8801811000002",
    email: "tanvir.rahman@example.com",
    age: 31,
    gender: "Male",
    lastDonationDate: "2026-01-22",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    about: "Can donate with prior notice for verified hospital requests.",
  },
  {
    ownerUid: "seed-user-003",
    fullName: "Nadia Islam",
    bloodGroup: "B-",
    district: "Sylhet",
    phone: "+8801911000003",
    email: "nadia.islam@example.com",
    age: 26,
    gender: "Female",
    lastDonationDate: "2025-12-18",
    available: false,
    imageUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=400&q=80",
    about: "Currently resting after recent donation cycle.",
  },
  {
    ownerUid: "seed-user-004",
    fullName: "Arif Hasan",
    bloodGroup: "AB+",
    district: "Rajshahi",
    phone: "+8801611000004",
    email: "arif.hasan@example.com",
    age: 35,
    gender: "Male",
    lastDonationDate: "2026-04-03",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    about: "Experienced donor comfortable with scheduled donations.",
  },
  {
    ownerUid: "seed-user-005",
    fullName: "Mithila Chowdhury",
    bloodGroup: "A-",
    district: "Khulna",
    phone: "+8801511000005",
    email: "mithila.chowdhury@example.com",
    age: 24,
    gender: "Female",
    lastDonationDate: "2026-02-10",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    about: "Available for urgent A negative donor requests.",
  },
  {
    ownerUid: "seed-user-006",
    fullName: "Sabbir Hossain",
    bloodGroup: "B+",
    district: "Barishal",
    phone: "+8801311000006",
    email: "sabbir.hossain@example.com",
    age: 29,
    gender: "Male",
    lastDonationDate: "2026-05-01",
    available: false,
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    about: "Resting now but open for future donation reminders.",
  },
  {
    ownerUid: "seed-user-007",
    fullName: "Farhana Akter",
    bloodGroup: "O-",
    district: "Rangpur",
    phone: "+8801411000007",
    email: "farhana.akter@example.com",
    age: 33,
    gender: "Female",
    lastDonationDate: "2026-01-05",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
    about: "O negative donor available for critical cases.",
  },
  {
    ownerUid: "seed-user-008",
    fullName: "Mehedi Karim",
    bloodGroup: "AB-",
    district: "Mymensingh",
    phone: "+8801811000008",
    email: "mehedi.karim@example.com",
    age: 38,
    gender: "Male",
    lastDonationDate: "2025-11-25",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    about: "Rare blood group donor, prefers direct hospital coordination.",
  },
  {
    ownerUid: "seed-user-009",
    fullName: "Rumana Sultana",
    bloodGroup: "A+",
    district: "Dhaka",
    phone: "+8801711000009",
    email: "rumana.sultana@example.com",
    age: 27,
    gender: "Female",
    lastDonationDate: "2026-04-20",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=400&q=80",
    about: "Available near central Dhaka for planned blood donation.",
  },
  {
    ownerUid: "seed-user-010",
    fullName: "Imran Mahmud",
    bloodGroup: "O+",
    district: "Sylhet",
    phone: "+8801911000010",
    email: "imran.mahmud@example.com",
    age: 41,
    gender: "Male",
    lastDonationDate: "2026-02-28",
    available: true,
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    about: "Long-time donor and volunteer for community blood drives.",
  },
];

const emergencyRequests = [
  {
    bloodGroup: "O+",
    district: "Dhaka",
    urgency: "Critical",
    contactName: "Hasan Ahmed",
    contactPhone: "+8801712000001",
    details: "Need 2 bags of O positive blood for surgery at Dhaka Medical College Hospital.",
  },
  {
    bloodGroup: "A+",
    district: "Chattogram",
    urgency: "Urgent",
    contactName: "Nusrat Jahan",
    contactPhone: "+8801812000002",
    details: "Patient admitted for emergency operation, donor needed today.",
  },
  {
    bloodGroup: "B-",
    district: "Sylhet",
    urgency: "High",
    contactName: "Rafiq Islam",
    contactPhone: "+8801912000003",
    details: "Rare blood group needed for accident patient.",
  },
  {
    bloodGroup: "AB+",
    district: "Rajshahi",
    urgency: "Medium",
    contactName: "Mariam Begum",
    contactPhone: "+8801612000004",
    details: "Scheduled transfusion required tomorrow morning.",
  },
  {
    bloodGroup: "A-",
    district: "Khulna",
    urgency: "Critical",
    contactName: "Sajid Hasan",
    contactPhone: "+8801512000005",
    details: "Need A negative blood urgently for ICU patient.",
  },
  {
    bloodGroup: "B+",
    district: "Barishal",
    urgency: "Urgent",
    contactName: "Tania Akter",
    contactPhone: "+8801312000006",
    details: "One bag B positive blood needed before evening.",
  },
  {
    bloodGroup: "O-",
    district: "Rangpur",
    urgency: "Critical",
    contactName: "Mahmudul Karim",
    contactPhone: "+8801412000007",
    details: "O negative donor needed immediately for emergency trauma case.",
  },
  {
    bloodGroup: "AB-",
    district: "Mymensingh",
    urgency: "High",
    contactName: "Sharmin Akter",
    contactPhone: "+8801812000008",
    details: "AB negative blood required for a child patient.",
  },
  {
    bloodGroup: "A+",
    district: "Dhaka",
    urgency: "Medium",
    contactName: "Kamal Hossain",
    contactPhone: "+8801712000009",
    details: "Blood needed for planned operation at private hospital.",
  },
  {
    bloodGroup: "O+",
    district: "Sylhet",
    urgency: "Urgent",
    contactName: "Jannatul Ferdous",
    contactPhone: "+8801912000010",
    details: "Need O positive donor within 6 hours for maternity patient.",
  },
];

async function seed() {
  await connectDB();

  await Promise.all(
    donors.map((donor) =>
      Donor.findOneAndUpdate({ ownerUid: donor.ownerUid }, donor, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      })
    )
  );

  await Promise.all(
    emergencyRequests.map((request) =>
      EmergencyRequest.findOneAndUpdate({ contactPhone: request.contactPhone }, request, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      })
    )
  );

  console.log(`Seeded ${donors.length} donors and ${emergencyRequests.length} emergency requests.`);
  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error("Seed failed:", error.message);
  await mongoose.disconnect();
  process.exit(1);
});
