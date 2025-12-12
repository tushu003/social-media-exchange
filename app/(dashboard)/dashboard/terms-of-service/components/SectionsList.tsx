import { Section } from "@/app/(dashboard)/dashboard/terms-of-service/types";

interface SectionsListProps {
  sections: Section[];
  onEdit: (section: Section) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export default function SectionsList({
  sections,
  onEdit,
  onDelete,
  isDeleting,
}: SectionsListProps) {
  // Create a reversed copy of the sections array
  const reversedSections = [...sections].reverse();

  return (
    <div className="space-y-8">
      {reversedSections.map((section, index) => {
        // Start numbering from 1 for the latest posts
        const sectionNumber = index + 1;

        return (
          <div key={section._id} className="border rounded-xl p-6">
            <div className="flex gap-3">
              <span className="text-lg font-medium">{sectionNumber}.</span>
              <h2 className="text-lg font-medium">{section.title}</h2>
            </div>
            <div
              className="mt-4 pl-8 space-y-3"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
            <div className="mt-4 pl-8 flex gap-4">
              <button
                onClick={() => onEdit(section)}
                className="text-[#20B894] hover:text-[#198d70] text-sm font-medium flex items-center gap-2 cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => section._id && onDelete(section._id)}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-600 text-sm font-medium flex items-center gap-2 cursor-pointer"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
