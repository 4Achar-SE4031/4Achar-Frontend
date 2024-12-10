export interface Event {
    id: number;
    title: string;
    details: string;
    start_date: string;
    start_hour: string;
    photo: string | null;
    province?: string | null;
    city?: string;
    category: string;
    ticket_price?: number;
    rating: number;
  }
  