import {useInfiniteQuery, useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import {
  eventsApi,
  EventSummaryResponse,
  EventListResult,
  EventDetailResponse,
  EventOptionResponse,
  ApplyEventRequest,
  EventUserApplicationResponse,
  CancelEventApplicationRequest,
} from '../api/events/events';

export type EventStatusLabel = '예정' | '모집중' | '마감';

export type EventSummary = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: EventStatusLabel;
  thumbnailUrl?: string;
};

export type EventOption = {
  optionId: number;
  name: string;
  type: string;
  displayOrder: number;
  capacity: number | null;
  appliedCount: number | null;
  remainingCount: number | null;
  children: EventOption[];
};

export type EventApplicationTrail = {
  eventOptionId: number;
  name: string;
  type: string;
};

export type EventUserApplication = {
  applicationId: number;
  status: string;
  appliedAt: string;
  optionTrail: EventApplicationTrail[];
} | null;

export type EventDetail = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  organizerName: string;
  organizerContact: string;
  status: EventStatusLabel;
  imageUrl?: string;
  images: Array<{
    imageId: number;
    url: string;
    altText: string;
    displayOrder: number;
  }>;
  optionDepth: number;
  options: EventOption[];
  userApplication: EventUserApplication;
};

function mapStatus(status: string): EventStatusLabel {
  switch (status) {
    case 'APPROVAL':
      return '예정';
    case 'OPEN':
      return '모집중';
    case 'CLOSED':
      return '마감';
    default:
      return '예정';
  }
}

function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function toSummary(item: EventSummaryResponse): EventSummary {
  return {
    id: String(item.eventId),
    title: item.title,
    description: item.description,
    status: mapStatus(item.status),
    startDate: formatEventDate(item.startDate),
    endDate: formatEventDate(item.endDate),
    location: item.location,
    thumbnailUrl: item.thumbnailUrl,
  };
}

function mapOptions(options: EventOptionResponse[]): EventOption[] {
  return options.map(option => ({
    optionId: option.optionId,
    name: option.name,
    type: option.type,
    displayOrder: option.displayOrder,
    capacity: option.capacity,
    appliedCount: option.appliedCount,
    remainingCount: option.remainingCount,
    children: mapOptions(option.children),
  }));
}

function mapUserApplication(
  userApplication?: EventUserApplicationResponse | null,
): EventUserApplication {
  if (!userApplication) {
    return null;
  }

  return {
    applicationId: userApplication.applicationId,
    status: userApplication.status,
    appliedAt: userApplication.appliedAt,
    optionTrail: userApplication.optionTrail.map(trail => ({
      eventOptionId: trail.eventOptionId,
      name: trail.name,
      type: trail.type,
    })),
  };
}

function toDetail(payload: EventDetailResponse): EventDetail {
  const mainImage = payload.images.find(img => img.displayOrder === 1);
  return {
    id: String(payload.eventId),
    title: payload.title,
    description: payload.description,
    status: mapStatus(payload.status),
    startDate: formatEventDate(payload.startDate),
    endDate: formatEventDate(payload.endDate),
    location: payload.location,
    organizerName: payload.organizerName,
    organizerContact: payload.organizerContact,
    imageUrl: mainImage?.url,
    images: payload.images.map(img => ({
      imageId: img.imageId,
      url: img.url,
      altText: img.altText,
      displayOrder: img.displayOrder,
    })),
    optionDepth: payload.optionDepth,
    options: mapOptions(payload.options),
    userApplication: mapUserApplication(payload.userApplication),
  };
}

export function useEventsList(params?: {status?: string | string[]}) {
  const defaultStatus = ['APPROVAL', 'OPEN', 'CLOSED'];
  const status = params?.status 
    ? (Array.isArray(params.status) ? params.status : [params.status])
    : defaultStatus;

  return useInfiniteQuery({
    queryKey: ['events', 'list', params],
    queryFn: ({pageParam}) =>
      eventsApi.getEvents({
        ...params,
        status,
        cursor: typeof pageParam === 'string' ? pageParam : undefined,
      }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
    select: data => ({
      ...data,
      pages: data.pages.map(page => ({
        ...page,
        events: page.events.map(toSummary),
      })),
    }),
  });
}

export function useEventDetail(
  eventId: string,
  initialData?: EventSummary,
) {
  return useQuery({
    queryKey: ['events', 'detail', eventId],
    queryFn: async () => {
      const detail = await eventsApi.getEventDetail(eventId);
      return toDetail(detail);
    },
    enabled: !!eventId,
  });
}

export function useApplyEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      body,
    }: {
      eventId: number;
      body: ApplyEventRequest;
    }) => eventsApi.applyEvent(eventId, body),
    onSuccess: (data, variables) => {
      const {eventId} = variables;
      // 이벤트 상세 정보를 다시 불러와서 최신 상태로 업데이트
      queryClient.invalidateQueries({
        queryKey: ['events', 'detail', String(eventId)],
      });
      // 이벤트 목록도 업데이트
      queryClient.invalidateQueries({
        queryKey: ['events', 'list'],
      });
      // 신청 목록도 업데이트
      queryClient.invalidateQueries({
        queryKey: ['applications', 'list'],
      });
    },
  });
}

export function useCancelEventApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      body,
      eventId,
    }: {
      applicationId: number;
      body: CancelEventApplicationRequest;
      eventId?: string;
    }) => eventsApi.cancelEventApplication(applicationId, body),
    onSuccess: (_, variables) => {
      const {applicationId, eventId} = variables;

      if (eventId) {
        queryClient.invalidateQueries({
          queryKey: ['events', 'detail', eventId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ['events', 'detail'],
          exact: false,
        });
      }

      queryClient.invalidateQueries({
        queryKey: ['events', 'list'],
      });

      // 신청 목록도 업데이트
      queryClient.invalidateQueries({
        queryKey: ['applications', 'list'],
      });

      // 개별 신청 관련 캐시가 있다면 무효화
      queryClient.invalidateQueries({
        queryKey: ['events', 'applications', applicationId],
      });
    },
  });
}

