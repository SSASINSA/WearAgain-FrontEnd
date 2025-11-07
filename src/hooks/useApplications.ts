import {
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import {applicationsApi} from '../api/events/applications';
import {
  ApplicationDetail,
  ApplicationOption,
  ApplicationStatusLabel,
  ApplicationSummary,
} from '../screens/applications/types';
import React from 'react';
import {Alert} from 'react-native';

function mapStatus(status?: string): ApplicationStatusLabel {
  switch (status) {
    case 'UPCOMING':
    case 'SCHEDULED':
    case 'OPENING':
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

function normalizeText(value?: string | string[]): string[] {
  if (!value) {
    return [];
  }

  const sanitize = (input?: string | null) => {
    if (!input) {
      return '';
    }
    return input
      .replace(/<\/?(p|div)>/gi, '\n')
      .replace(/<\/?(ul|ol)>/gi, '\n')
      .replace(/<\/?li>/gi, '\n')
      .replace(/<br\s*\/?\s*>/gi, '\n')
      .replace(/\r\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/[•·]/g, '\n')
      .replace(/<[^>]+>/g, ' ');
  };

  const toList = (input: string | string[]): string[] => {
    if (Array.isArray(input)) {
      return input;
    }

    const trimmed = input.trim();
    if (!trimmed) {
      return [];
    }

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }
    } catch (error) {
      // ignore json parsing failures and fall back to plain text parsing
    }

    return sanitize(trimmed).split('\n');
  };

  return toList(value)
    .map(item => sanitize(item))
    .flatMap(item => item.split('\n'))
    .map(line => line.replace(/^[\-–—·•\d\.\)\s]+/, '').trim())
    .filter(Boolean);
}

function mapOptionTrail(
  trail: applicationsApi.ApplicationDetailResponse['optionTrail'],
): ApplicationOption[] {
  if (!Array.isArray(trail)) {
    return [];
  }
  return trail.map(option => ({
    eventOptionId: option.eventOptionId,
    name: option.name,
    type: option.type,
  }));
}

function toSummary(
  item: applicationsApi.ApplicationSummaryResponse,
): ApplicationSummary {
  return {
    id: String(item.applicationId),
    eventId: String(item.eventId),
    title: item.eventTitle,
    description: item.description,
    status: mapStatus(item.eventStatus ?? item.applicationStatus),
    startDate: item.eventPeriod.startDate,
    endDate: item.eventPeriod.endDate,
    location: item.location,
    address: item.address ?? undefined,
    thumbnailUrl: item.thumbnailUrl ?? undefined,
  };
}

function toDetail(
  payload: applicationsApi.ApplicationDetailResponse,
): ApplicationDetail {
  const base = toSummary(payload);
  return {
    ...base,
    usageGuide: normalizeText(payload.usageGuide),
    precautions: normalizeText(payload.precautions),
    optionTrail: mapOptionTrail(payload.optionTrail),
  };
}

export function useApplicationsList() {
  return useInfiniteQuery({
    queryKey: ['applications', 'list'],
    queryFn: ({pageParam}) =>
      applicationsApi.getApplications({cursor: pageParam ?? undefined}),
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
  return useQuery({
    queryKey: ['applications', 'detail', applicationId],
    queryFn: async () => {
      const detail = await applicationsApi.getApplicationDetail(applicationId);
      return toDetail(detail);
    },
    placeholderData: initialData
      ? toDetail({
          ...initialData,
          eventPeriod: {
            startDate: initialData.startDate,
            endDate: initialData.endDate,
          },
        } as applicationsApi.ApplicationDetailResponse)
      : undefined,
  });
}

export function useApplicationQr(applicationId: string) {
  const [qrToken, setQrToken] = React.useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = React.useState<number>(0);

  const {mutate, isPending} = useMutation({
    mutationFn: () => applicationsApi.issueApplicationQr(applicationId),
    onSuccess: data => {
      setQrToken(data.qrToken);
      setSecondsLeft(data.expiresIn);
    },
    onError: () => {
      Alert.alert(
        'QR 발급 실패',
        'QR을 발급하지 못했습니다. 잠시 후 다시 시도해주세요.',
      );
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
    if (!applicationId || isPending) {
      return;
    }
    mutate();
  }, [applicationId, isPending, mutate]);

  React.useEffect(() => {
    if (!applicationId) {
      return;
    }
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  return {
    qrToken,
    secondsLeft,
    isIssuing: isPending,
    isExpired: !!qrToken && secondsLeft <= 0,
    reissue,
  };
}
