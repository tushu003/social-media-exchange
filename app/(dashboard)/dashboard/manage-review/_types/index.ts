export type ReviewStatus = "accept" | "reject" | "pending";

export interface Review {
  id: string;
  reviewer: {
    name: string;
    email: string;
    avatar: string;
  };
  flaggedBy: {
    name: string;
    avatar: string;
  };
  reviewText: string;
  rating: number;
  status: ReviewStatus;
  createdAt: string;
  reportDetails: string;
  reportDocument: string;
  personalInfo: any;
  document?: string;
}
