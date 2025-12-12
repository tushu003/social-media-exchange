import serviceOne from "@/public/client/services/service-01.png";
import serviceTwo from "@/public/client/services/service-02.png";
import serviceThree from "@/public/client/services/service-03.png";
import serviceFour from "@/public/client/services/service-04.png";
import serviceFive from "@/public/client/services/service-05.png";
import serviceSix from "@/public/client/services/service-06.png";

const generateInstructor = (name, experience, image) => ({
  image,
  name,
  location: "Unknown", // Placeholder, can be updated
  email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
  languages: ["English"], // Default language
  totalReview: Math.floor(Math.random() * 300),
  experience,
  about: "Experienced professional in the field with a passion for teaching and mentoring. I have a strong background in the subject matter and a proven track record of success. I am committed to providing high-quality instruction  to my students. I am excited to share my knowledge and expertise with you. I am confident that I can help you achieve your goals.",
  description: `Has been actively working for ${experience} in the industry and helping others succeed.`,
  status: "Online",
  offlineTime: "N/A",
  rating: (Math.random() * (5 - 4.5) + 4.5).toFixed(1),
  reviewCount: Math.floor(Math.random() * 300),
  skills: ["Web Development", "Graphic Design", "Music Production", "Photography", "Video Editing"],
  portfolioImage: image,
  customerSatisfaction: Math.floor(Math.random() * 100),
  isVerified: true,
});

export const serviceCategories = [
  {
    title: "Education & Learning",
    items: [
      {
        id: 1,
        title: "Mathematics Tutoring",
        instructor: generateInstructor("John Smith", "10+ years", serviceOne),
        rating: 4.9,
        reviewCount: 150,
        image: serviceOne,
      },
      {
        id: 2,
        title: "Piano Lessons",
        instructor: generateInstructor("Sarah Wilson", "10+ years", serviceTwo),
        rating: 4.8,
        reviewCount: 120,
        image: serviceTwo,
      },
      {
        id: 3,
        title: "Web Development Course",
        instructor: generateInstructor("Michael Chen", "7+ years", serviceThree),
        rating: 4.7,
        reviewCount: 200,
        image: serviceThree,
      },
    ],
  },
  {
    title: "Professional & Business Services",
    items: [
      {
        id: 4,
        title: "Logo Design",
        instructor: generateInstructor("Alex Johnson", "6+ years", serviceFour),
        rating: 4.8,
        reviewCount: 180,
        image: serviceFour,
      },
      {
        id: 5,
        title: "Business Consulting",
        instructor: generateInstructor("Lisa Brown", "12+ years", serviceSix),
        rating: 4.9,
        reviewCount: 220,
        image: serviceSix,
      },
    ],
  },
  {
    title: "Events & Entertainment",
    items: [
      {
        id: 6,
        title: "Wedding Photography",
        instructor: generateInstructor("Emily White", "9+ years", serviceFive),
        rating: 4.8,
        reviewCount: 160,
        image: serviceFive,
      },
      {
        id: 7,
        title: "Live Band Performance",
        instructor: generateInstructor("James Wilson", "15+ years", serviceFour),
        rating: 4.9,
        reviewCount: 190,
        image: serviceFour,
      },
    ],
  },
];
