export type Certificate = {
  title: string;
  issuer: string;
  date: string;
  description: string;
  isFeatured?: boolean;
};

export const certificates: Certificate[] = [
  {
    title: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services (AWS)",
    date: "2024",
    description:
      "Validates foundational knowledge of AWS Cloud concepts, services, security, architecture, pricing, and support.",
    isFeatured: true,
  },
  {
    title: "AWS re/Start Graduate",
    issuer: "Amazon Web Services (AWS)",
    date: "2022",
    description:
      "Completed the AWS re/Start program covering cloud computing, Linux, networking, security, Python scripting, and core AWS services.",
  },
  {
    title: "AWS Academy Cloud Foundations",
    issuer: "Amazon Web Services (AWS)",
    date: "2022",
    description:
      "Foundational understanding of cloud concepts, AWS core services, security, architecture, and pricing models.",
  },
  {
    title: "Foundations of User Experience (UX) Design",
    issuer: "Google",
    date: "2023",
    description:
      "Covers the basics of UX design including the design process, user research, wireframing, and prototyping.",
  },
  {
    title: "Computer Systems Servicing NC II",
    issuer: "Technical Education and Skills Development Authority (TESDA)",
    date: "2021",
    description:
      "National Certificate II in computer hardware servicing, installation, and network configuration.",
  },
];
