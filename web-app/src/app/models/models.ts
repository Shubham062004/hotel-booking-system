export interface Hotel {
  id: string;
  name: string;
  price: number;
  availableDates: string[];
}

export interface Booking {
  id: string;
  hotelId: string;
  username: string;
  date: string;
  amount: number;
}

export interface AuthResponse {
  token: string;
  role: string;
}

export interface BookingResponse {
  success: boolean;
  message: string;
}
