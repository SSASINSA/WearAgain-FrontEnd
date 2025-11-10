import {apiClient} from '../client';

export type EventListParams = {
  status?: string;
  cursor?: string;
  size?: number;
};

export type EventSummaryResponse = {
  eventId: number;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: string;
  thumbnailUrl: string;
};

export type EventListResult = {
  events: EventSummaryResponse[];
  nextCursor?: string | null;
  hasNext: boolean;
};

export type EventImageResponse = {
  imageId: number;
  url: string;
  altText: string;
  displayOrder: number;
};

export type EventOptionResponse = {
  optionId: number;
  name: string;
  type: string;
  displayOrder: number;
  capacity: number;
  appliedCount: number;
  remainingCount: number;
  children: EventOptionResponse[];
};

export type EventDetailResponse = {
  eventId: number;
  title: string;
  description: string;
  location: string;
  organizerName: string;
  organizerContact: string;
  startDate: string;
  endDate: string;
  status: string;
  images: EventImageResponse[];
  options: EventOptionResponse[];
};

const BASE_PATH = '/events';

export type ApplyEventRequest = {
  optionId: number;
  memo?: string;
};

export type ApplyEventResponse = {
  applicationId: string;
  eventId: number;
};

export const eventsApi = {
  async getEvents(params: EventListParams = {}) {
    const {data} = await apiClient.get<EventListResult>(BASE_PATH, {
      params,
    });
    return data;
  },

  async getEventDetail(eventId: string) {
    const {data} = await apiClient.get<EventDetailResponse>(
      `${BASE_PATH}/${eventId}`,
    );
    return data;
  },

  async applyEvent(eventId: number, body: ApplyEventRequest) {
    const {data} = await apiClient.post<ApplyEventResponse>(
      `${BASE_PATH}/${eventId}/apply`,
      body,
    );
    return data;
  },
};

