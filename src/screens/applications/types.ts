export type ApplicationStatusLabel = '진행중' | '종료' | '예정';

export type ApplicationSummary = {
  id: string;
  eventId: string;
  title: string;
  description: string;
  status: ApplicationStatusLabel;
  startDate: string;
  endDate: string;
  location: string;
  address?: string;
  thumbnailUrl?: string;
};

export type ApplicationOption = {
  eventOptionId: number;
  name: string;
  type: string;
};

export type ApplicationDetail = ApplicationSummary & {
  usageGuide: string[];
  precautions: string[];
  optionTrail: ApplicationOption[];
};
