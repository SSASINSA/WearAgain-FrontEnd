import {apiClient} from './client';

export type TicketQrResponse = {
  ticketCount: number;
  ticketToken: string;
  ticketTokenExpiresIn: number;
};

const BASE_PATH = '/tickets';

export const ticketsApi = {
  async getQr() {
    const {data} = await apiClient.get<TicketQrResponse>(`${BASE_PATH}/qr`);
    return data;
  },
};

