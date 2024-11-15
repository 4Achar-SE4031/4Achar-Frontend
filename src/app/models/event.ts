export interface Event {
    id: number;
    title: string;
    start_date: string;
    attendance: string;
    photo: string | null;
    province?: string | null;
    city?: string;
    category: string;
    is_paid: boolean;
    ticket_price?: number;
    rating: number;
  }
  