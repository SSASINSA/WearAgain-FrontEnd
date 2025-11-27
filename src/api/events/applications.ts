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
  address?: string | null;
  eventPeriod: {
    startDate: string;
    endDate: string;
  };
  eventStatus: string;
  applicationStatus?: string;
};

export type ApplicationDetailResponse = ApplicationSummaryResponse & {
  usageGuide?: string | string[];
  precautions?: string | string[];
  optionTrail?: Array<{
    eventOptionId: number;
    name: string;
    type: string;
  }>;
};

export type ApplicationListResult = {
  items: ApplicationSummaryResponse[];
  nextCursor?: string | null;
  hasNext: boolean;
};

export type ApplicationQrResponse = {
  qrToken: string;
  expiresIn: number;
};

export type CancelApplicationRequest = {
  reason: string;
};

export type CancelApplicationResponse = {
  applicationId: number;
  status: string;
};

const BASE_PATH = '/events/applications';

export const applicationsApi = {
  async getApplications(params: ApplicationListParams = {}) {
    const {data} = await apiClient.get<ApplicationListResult>(BASE_PATH, {
      params,
    });
    return data;
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

  async cancelApplication(applicationId: string, body: CancelApplicationRequest) {
    const {data} = await apiClient.patch<CancelApplicationResponse>(
      `${BASE_PATH}/${applicationId}/cancel`,
      body,
    );
    return data;
  },
};
