import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  applicationsApi,
  ApplicationSummaryResponse,
  ApplicationDetailResponse,
} from '../api/events/applications';
import {
  ApplicationDetail,
  ApplicationSummary,
  ApplicationStatusLabel,
  ApplicationOption,
} from '../screens/applications/types';
import {Alert} from 'react-native';
import React from 'react';

function mapStatus(status?: string): ApplicationStatusLabel {
  switch (status) {
    case 'UPCOMING':
    case 'OPENING':
    case 'SCHEDULED':
      return '예정';
    case 'OPEN':
    case 'RUNNING':
      return '진행중';
    case 'CLOSED':
    case 'FINISHED':
    case 'ENDED':
      return '종료';
    default:
      return '진행중';
  }
}

function mapUsage(value?: string | string[]): string[] {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value;
  }
  return value
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
}

function toSummary(item: ApplicationSummaryResponse): ApplicationSummary {
  return {
    id: String(item.applicationId),
    eventId: String(item.eventId),
    title: item.eventTitle,
    description: item.description,
    status: mapStatus(item.eventStatus),
    startDate: item.eventPeriod.startDate,
    endDate: item.eventPeriod.endDate,
    location: item.location,
    address: item.address,
    thumbnailUrl: item.thumbnailUrl ?? undefined,
  };
}

function toOptionTrail(
  options: ApplicationDetailResponse['optionTrail'],
): ApplicationOption[] {
  if (!Array.isArray(options)) {
    return [];
  }
  return options.map(option => ({
    eventOptionId: option.eventOptionId,
    name: option.name,
    type: option.type,
  }));
}

function toDetail(detail: ApplicationDetailResponse): ApplicationDetail {
  const base = toSummary(detail);
  return {
    ...base,
    usageGuide: mapUsage(detail.usageGuide),
    precautions: mapUsage(detail.precautions),
    optionTrail: toOptionTrail(detail.optionTrail),
  };
}

export function useApplicationsList() {
  return useInfiniteQuery({
    queryKey: ['applications', 'list'],
    queryFn: ({pageParam}) =>
      applicationsApi.getApplications({
        cursor: pageParam ?? undefined,
      }),
    getNextPageParam: lastPage =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
    select: data => ({
      ...data,
      pages: data.pages.map(page => ({
        ...page,
        items: page.items.map(toSummary),
      })),
    }),
  });
}

export function useApplicationDetail(
  applicationId: string,
  initialData?: ApplicationSummary,
) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['applications', 'detail', applicationId],
    queryFn: async () => {
      const detail = await applicationsApi.getApplicationDetail(applicationId);
      return toDetail(detail);
    },
    initialData: initialData
      ? {
          ...initialData,
          usageGuide: [],
          precautions: [],
          optionTrail: [],
        }
      : undefined,
  });
}

type UseApplicationQrOptions = {
  onError?: (message: string) => void;
};

export function useApplicationQr(
  applicationId: string,
  {onError}: UseApplicationQrOptions = {},
) {
  const [qrToken, setQrToken] = React.useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = React.useState<number>(0);

  const mutation = useMutation({
    mutationFn: () => applicationsApi.issueApplicationQr(applicationId),
    onSuccess: data => {
      setQrToken(data.qrToken);
      setSecondsLeft(data.expiresIn);
    },
    onError: () => {
      const message = 'QR을 발급하지 못했습니다. 잠시 후 다시 시도해주세요.';
      if (onError) {
        onError(message);
      } else {
        Alert.alert('QR 발급 실패', message);
      }
    },
  });

  React.useEffect(() => {
    if (!secondsLeft) {
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const reissue = React.useCallback(() => {
    if (!applicationId) {
      return;
    }
    mutation.mutate();
  }, [applicationId, mutation]);

  return {
    qrToken,
    secondsLeft,
    isIssuing: mutation.isPending,
    isExpired: !!qrToken && secondsLeft <= 0,
    reissue,
  };
}
