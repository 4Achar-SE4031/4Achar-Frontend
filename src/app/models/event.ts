export interface Event {
    id: number;
    title: string;
    details: string;
    startDateTime: string;
    cardImage: string | null;
    location?: string | null;
    city?: string;
    category: string;
    ticketPrice?: number[] | null; 
    rating: number;
  }
  