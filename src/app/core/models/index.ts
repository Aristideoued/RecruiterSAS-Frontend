// ======= AUTH =======
export interface LoginRequest { email: string; password: string; }
export interface AuthResponse {
  token: string; refreshToken: string; userId: string;
  email: string; firstName: string; lastName: string;
  role: 'SUPER_ADMIN' | 'RECRUITER'; expiresIn: number;
}

// ======= PAGINATION =======
export interface PageResponse<T> {
  content: T[]; page: number; size: number;
  totalElements: number; totalPages: number;
  last: boolean; first: boolean;
}

// ======= PLAN =======
export interface Plan {
  id: string; name: string; description: string; monthlyPrice: number;
  maxJobOffers: number; maxApplicationsPerOffer: number;
  cvParsingEnabled: boolean; analyticsEnabled: boolean;
  customBrandingEnabled: boolean; active: boolean;
}
export interface PlanRequest {
  name: string; description: string; monthlyPrice: number;
  maxJobOffers: number; maxApplicationsPerOffer: number;
  cvParsingEnabled: boolean; analyticsEnabled: boolean; customBrandingEnabled: boolean;
}

// ======= SUBSCRIPTION =======
export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
export interface Subscription {
  id: string; plan: Plan; status: SubscriptionStatus;
  startDate: string; endDate: string; trialEndDate: string;
  nextBillingDate: string; createdAt: string;
}

// ======= RECRUITER =======
export interface Recruiter {
  id: string; userId: string; email: string;
  firstName: string; lastName: string; companyName: string;
  companyLogo: string; companyWebsite: string; phone: string;
  address: string; siret: string; slug: string;
  enabled: boolean; subscription: Subscription; createdAt: string;
}
export interface RegisterRecruiterRequest {
  email: string; password: string; firstName: string; lastName: string;
  companyName: string; companyWebsite?: string; phone?: string;
  address?: string; siret?: string; planId?: string;
}
export interface UpdateRecruiterRequest {
  email?: string; firstName?: string; lastName?: string; companyName?: string;
  companyWebsite?: string; phone?: string; address?: string; siret?: string;
}

// ======= JOB OFFER =======
export type JobOfferStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
export interface JobOffer {
  id: string; title: string; description: string; requirements: string;
  location: string; contractType: string; workMode: string; salaryRange: string;
  experienceLevel: string; category: string; status: JobOfferStatus;
  applicationCount: number; publishedAt: string; closingDate: string;
  createdAt: string; updatedAt: string;
  recruiterProfileId: string; recruiterCompanyName: string;
  recruiterCompanyLogo: string; recruiterSlug: string;
}
export interface JobOfferRequest {
  title: string; description: string; requirements?: string; location?: string;
  contractType?: string; workMode?: string; salaryRange?: string;
  experienceLevel?: string; category?: string; status?: JobOfferStatus; closingDate?: string;
}

// ======= APPLICATION =======
export type ApplicationStatus = 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
export type FileType = 'CV' | 'COVER_LETTER' | 'PORTFOLIO' | 'OTHER';
export interface ApplicationFile {
  id: string; originalFileName: string; mimeType: string;
  fileSize: number; fileType: FileType; downloadUrl: string; uploadedAt: string;
}
export interface JobApplication {
  id: string; candidateFirstName: string; candidateLastName: string;
  candidateEmail: string; candidatePhone: string; candidateLinkedin: string;
  coverLetterText: string; recruiterNotes: string; status: ApplicationStatus;
  rating: number; files: ApplicationFile[];
  submittedAt: string; updatedAt: string; reviewedAt: string;
  jobOfferId: string; jobOfferTitle: string;
}
export interface JobApplicationRequest {
  candidateFirstName: string; candidateLastName: string; candidateEmail: string;
  candidatePhone?: string; candidateLinkedin?: string; coverLetterText?: string;
}

// ======= DASHBOARD =======
export interface DashboardStats {
  totalJobOffers: number; publishedJobOffers: number; draftJobOffers: number;
  closedJobOffers: number; totalApplications: number; pendingApplications: number;
  shortlistedApplications: number; hiredApplications: number;
  totalRecruiters: number; activeRecruiters: number; suspendedRecruiters: number;
  totalPlans: number; totalSubscriptions: number; activeSubscriptions: number;
}
