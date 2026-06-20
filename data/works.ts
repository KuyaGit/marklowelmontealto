export type Work = {
  slug: string;
  title: string;
  company: string;
  period: string;
  description: string;
  image: string;
  isFeatured?: boolean;
};

export const works: Work[] = [
  {
    slug: "devops-whitecloak",
    title: "DevOps Engineer",
    company: "Whitecloak Technologies, Inc.",
    period: "February 2025 – Present",
    description:
      "Implemented CI/CD pipelines improving deployment speed by 40%. Optimized cloud infrastructure reducing operational costs by 30%. Developed automated monitoring solutions that cut incident response time by 25%.",
    image: "",
    isFeatured: true,
  },
  {
    slug: "angular-outdoor-inspection",
    title: "Angular Developer",
    company: "Outdoor Inspection Services",
    period: "September 2024 – November 2024",
    description:
      "Built dynamic inspection dashboards using Angular. Integrated REST APIs for inspection data management and implemented Google Maps integration for tracking and route planning.",
    image: "",
  },
  {
    slug: "fullstack-prulife",
    title: "Full Stack Developer",
    company: "Pru Life UK",
    period: "May 2024 – September 2024",
    description:
      "Developed and maintained internal business applications. Diagnosed and resolved production issues. Contributed to frontend and backend features with cloud-native and serverless architectures.",
    image: "",
  },
  {
    slug: "web-dev-createit",
    title: "Web Developer",
    company: "Create IT Batangas",
    period: "January 2023 – February 2024",
    description:
      "Developed responsive Angular web applications. Collaborated with UX/UI designers to create intuitive interfaces and maintained enterprise-level Angular applications.",
    image: "",
  },
  {
    slug: "qa-ai4gov",
    title: "Quality Assurance Specialist",
    company: "AI4GOV",
    period: "August 2023 – December 2023",
    description:
      "Performed manual and automated testing using Cypress. Created test cases and testing documentation, collaborating closely with developers to improve software quality.",
    image: "",
  },
  {
    slug: "frontend-createit",
    title: "Frontend Developer",
    company: "CreateIT Batangas",
    period: "January 2022 – August 2023",
    description:
      "Built modern Angular applications with responsive and accessible user interfaces. Collaborated with design teams to improve user experience.",
    image: "",
  },
];
