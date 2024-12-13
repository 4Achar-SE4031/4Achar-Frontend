export interface Event {
    id: number;
    title: string;
    details: string;
    startDate: string;
    startHour: string;
    photo: string | null;
    province?: string | null;
    city?: string;
    category: string;
    ticket_price?: number;
    rating: number;
  }
  