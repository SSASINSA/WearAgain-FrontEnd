import {useQuery} from '@tanstack/react-query';
import {ticketsApi} from '../api/tickets';

export function useTicketsQr(enabled: boolean = true) {
  return useQuery({
    queryKey: ['tickets', 'qr'],
    queryFn: () => ticketsApi.getQr(),
    enabled,
    refetchOnWindowFocus: false,
  });
}

