"use client";

import { CollectionManager } from "@/components/dashboard/collection-manager";

export default function EducationPage() {
  return (
    <CollectionManager
      table="education"
      title="Education"
      description="Your academic qualifications."
      addLabel="Add education"
      primary={(r) => r.degree}
      secondary={(r) => `${r.institution}${r.grade ? " · " + r.grade : ""}`}
      fields={[
        { name: "degree", label: "Degree", colSpan: 2, required: true },
        { name: "institution", label: "Institution", colSpan: 2, required: true },
        { name: "field", label: "Field of study" },
        { name: "grade", label: "Grade / CGPA" },
        { name: "start_date", label: "Start date", placeholder: "e.g. March 2022" },
        { name: "end_date", label: "End date", placeholder: "e.g. Present" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      ]}
    />
  );
}
