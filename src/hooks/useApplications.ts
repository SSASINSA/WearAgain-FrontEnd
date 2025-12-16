import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  applicationsApi,
  ApplicationDetailResponse,
  ApplicationSummaryResponse,
  ApplicationListResult,
  CancelApplicationRequest,
} from '../api/events/applications';
import {
  ApplicationDetail,
  ApplicationOption,
  ApplicationStatusLabel,
  ApplicationSummary,
} from '../screens/applications/types';
import React from 'react';
import {
  Alert
} from 'react-native';

type ApiError = {
  response?: {
    data?: {
      code?: string;
      errorCode?: string;
      message?: string;
      statusCode?: string | number;
    };
  };
};

function mapStatus(status?: string): ApplicationStatusLabel {
  switch (status) {
    case 'UPCOMING':
    case 'SCHEDULED':
    case 'APPROVAL':
      return '예정';
    case 'OPEN':
      return '진행';
    case 'CLOSED':
    case 'FINISHED':
    case 'CLOSED':
      return '종료';
    default:
      return '진행';
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
  trail: ApplicationDetailResponse['optionTrail'],
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
  item: ApplicationSummaryResponse,
): ApplicationSummary {
  return {
    id: String(item.applicationId),
    eventId: String(item.eventId),
    title: item.eventTitle,
    description: item.description,
    eventStatusCode: item.eventStatus,
    applicationStatusCode: item.applicationStatus ?? undefined,
    status: mapStatus(item.eventStatus ?? item.applicationStatus),
    startDate: item.eventPeriod.startDate,
    endDate: item.eventPeriod.endDate,
    location: item.location,
    address: item.address ?? undefined,
    thumbnailUrl: item.thumbnailUrl ?? undefined,
  };
}

function toDetail(
  payload: ApplicationDetailResponse,
): ApplicationDetail {
  const base = toSummary(payload);
  return {
    ...base,
    eventStatusCode: payload.eventStatus,
    applicationStatusCode: payload.applicationStatus ?? undefined,
    usageGuide: normalizeText(payload.usageGuide),
    precautions: normalizeText(payload.precautions),
    optionTrail: mapOptionTrail(payload.optionTrail),
  };
}

export function useApplicationsList() {
  return useInfiniteQuery<ApplicationListResult, Error, any, ['applications', 'list'], string | undefined>({
    initialPageParam: undefined,
    queryKey: ['applications', 'list'],
    queryFn: ({pageParam}) =>
      applicationsApi.getApplications({
        cursor: pageParam ?? undefined,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor ?? undefined : undefined,
    select: (data) =>
      ({
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.map(toSummary),
        })),
      } as any),
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
      ? ({
          ...initialData,
          usageGuide: [],
          precautions: [],
          optionTrail: [],
        } as ApplicationDetail)
      : undefined,
  });
}

type UseApplicationQrOptions = {
  enabled?: boolean;
  fallbackError?: QrErrorInfo;
};

export function useApplicationQr(
  applicationId: string,
  options?: UseApplicationQrOptions,
) {
  const enabled = options?.enabled ?? true;
  const [qrToken, setQrToken] = React.useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = React.useState<number>(0);
  const [errorInfo, setErrorInfo] = React.useState<QrErrorInfo | null>(
    enabled ? null : options?.fallbackError ?? null,
  );

  const {mutate, isPending} = useMutation({
    mutationFn: () => applicationsApi.issueApplicationQr(applicationId),
    onSuccess: data => {
      setQrToken(data.qrToken);
      setSecondsLeft(data.expiresIn);
      setErrorInfo(null);
    },
    onError: error => {
      setQrToken(null);
      setSecondsLeft(0);

      const nextError = buildQrErrorMessage(error);
      setErrorInfo(nextError);
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
    if (!enabled) {
      return;
    }
    setErrorInfo(null);
    mutate();
  }, [applicationId, enabled, isPending, mutate]);

  React.useEffect(() => {
    if (!enabled) {
      setErrorInfo(options?.fallbackError ?? null);
      return;
    }
    if (!applicationId) {
      return;
    }
    mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId, enabled]);

  return {
    qrToken,
    secondsLeft,
    isIssuing: isPending,
    isExpired: !!qrToken && secondsLeft <= 0,
    hasError: !!errorInfo,
    errorMessage: errorInfo?.message ?? null,
    isCompletedError: errorInfo?.state === 'completed',
    errorState: errorInfo?.state ?? null,
    isDisabled: !enabled,
    reissue,
  };
}

type QrErrorInfo = {
  message: string;
  state: 'completed' | 'ended' | 'canceled' | 'generic';
};

function buildQrErrorMessage(error: unknown): QrErrorInfo {
  const apiError = error as ApiError;
  const code =
    apiError?.response?.data?.errorCode ?? apiError?.response?.data?.code;
  const statusCode = apiError?.response?.data?.statusCode;

  if (typeof code === 'string' && code.startsWith('E')) {
    return mapQrErrorCode(code);
  }

  if (typeof statusCode === 'string' && statusCode.toUpperCase() === 'CLOSED') {
    return mapQrErrorCode('E1031');
  }

  return {
    message: 'QR을 발급하지 못했습니다. 잠시 후 다시 시도해주세요.',
    state: 'generic',
  };
}

function mapQrErrorCode(code: string): QrErrorInfo {
  if (code === 'E1019') {
    return {
      message: '이미 체크인이 완료된 신청이에요. 현장 직원에게 문의해 주세요.',
      state: 'completed',
    };
  }
  if (code === 'E1031' || code === 'E1030') {
    return {
      message: '행사가 종료되어 QR을 발급할 수 없어요.',
      state: 'ended',
    };
  }
  if (code === 'E1032' || code === 'E1033') {
    return {
      message: '신청이 취소되어 QR을 발급할 수 없어요.',
      state: 'canceled',
    };
  }

  return {
    message: 'QR을 발급하지 못했습니다. 잠시 후 다시 시도해주세요.',
    state: 'generic',
  };
}

export function useCancelApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      body,
      eventId,
    }: {
      applicationId: string;
      body: CancelApplicationRequest;
      eventId?: string;
    }) => applicationsApi.cancelApplication(applicationId, body),
    onSuccess: (_, variables) => {
      const {
        applicationId,
        eventId
      } = variables;

      queryClient.invalidateQueries({
        queryKey: ['applications', 'detail', applicationId],
      });

      queryClient.invalidateQueries({
        queryKey: ['applications', 'list'],
      });

      queryClient.invalidateQueries({
        queryKey: ['events', 'list'],
      });

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
    },
  });
}
