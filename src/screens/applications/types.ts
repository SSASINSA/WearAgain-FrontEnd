export type ApplicationStatus = '진행중' | '종료' | '예정';

export type ApplicationHistory = {
  id: string;
  title: string;
  description: string;
  status: ApplicationStatus;
  startDate: string;
  endDate: string;
  location: string;
  address: string;
  imageUrl: string;
  usageGuide: string[];
  precautions: string[];
  optionTrail: Array<{
    eventOptionId: number;
    name: string;
    type: string;
  }>;
  qrToken: string;
  expiresInSeconds: number;
};
