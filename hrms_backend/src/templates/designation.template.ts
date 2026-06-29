export type industryTemplates = Record<string, string[]>;
export const designationTemplates: Record<string, industryTemplates> = {

  it: {

    HR: [
      "HR Executive",
      "HR Manager",
      "Talent Acquisition"
    ],

    IT: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "QA Engineer"
    ],

    Finance: [
      "Accountant",
      "Finance Manager"
    ],

    Sales: [
      "Sales Executive",
      "Sales Manager"
    ],

    Administration: [
      "Office Admin",
      "Admin Manager"
    ]

  },

  finance: {

    Finance: [
      "Accountant",
      "Senior Accountant",
      "Finance Manager"
    ],

    HR: [
      "HR Executive"
    ],

    Accounts: [
      "Account Executive"
    ],

    Audit: [
      "Auditor"
    ]

  },

  healthcare: {

    Doctor: [
      "General Physician",
      "Cardiologist"
    ],

    Nursing: [
      "Senior Nurse",
      "Junior Nurse"
    ],

    Reception: [
      "Receptionist"
    ],

    Accounts: [
      "Account Executive"
    ],

    Pharmacy: [
      "Pharmacist"
    ]
  },

  manufacturing: {

    Production: [
      "Production Engineer",
      "Production Manager"
    ],

    Quality: [
      "Quality Inspector",
      "QA Manager"
    ],

    Warehouse: [
      "Warehouse Executive"
    ],

    Purchase: [
      "Purchase Officer"
    ],

    HR: [
      "HR Executive"
    ]

  }

};