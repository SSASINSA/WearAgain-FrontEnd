import {apiClient} from '../client';

export type ApplicationListParams = {
  status?: string;
  from?: string;
  to?: string;
  cursor?: string;
  limit?: number;
};

export type ApplicationSummaryResponse = {
  applicationId: string;
  eventId: string;
  eventTitle: string;
  thumbnailUrl?: string | null;
  description: string;
  location: string;
  address?: string;
  eventPeriod: {
    startDate: string;
    endDate: string;
  };
  eventStatus: string;
  applicationStatus?: string;
};

export type ApplicationDetailResponse = ApplicationSummaryResponse & {
  usageGuide: string | string[];
  precautions: string | string[];
  optionTrail: Array<{
    eventOptionId: number;
    name: string;
    type: string;
  }>;
};

export type ApplicationsCursorResponse = {
  items: ApplicationSummaryResponse[];
  nextCursor?: string | null;
  hasNext: boolean;
};

export type ApplicationQrResponse = {
  qrToken: string;
  expiresIn: number;
};

const BASE_PATH = '/events/applications';

export const applicationsApi = {
  async getApplications(params: ApplicationListParams = {}) {
    const response = await apiClient.get<ApplicationsCursorResponse>(BASE_PATH, {
      params,
    });
    console.log(response);
    return response.data;
  },

  async getApplicationDetail(applicationId: string) {
    const {data} = await apiClient.get<ApplicationDetailResponse>(
      `${BASE_PATH}/${applicationId}`,
    );
    return data;
  },

  async issueApplicationQr(applicationId: string) {
    const {data} = await apiClient.post<ApplicationQrResponse>(
      `${BASE_PATH}/${applicationId}/qr`,
    );
    return data;
  },
};

