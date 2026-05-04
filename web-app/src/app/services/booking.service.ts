import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, BookingResponse, Hotel } from '../models/models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly HOTELS_API = '/api/hotels';
  private readonly BOOK_API = '/api/book';
  private readonly BOOKINGS_API = '/api/bookings';

  constructor(private http: HttpClient) {}

  getHotels(): Observable<Hotel[]> {
    return this.http.get<Hotel[]>(this.HOTELS_API);
  }

  bookHotel(hotelId: string, date: string): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.BOOK_API, { hotelId, date });
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.BOOKINGS_API);
  }
}
