import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Hotel } from '../../models/models';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss',
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  loading = true;

  /** Selected Date object per hotel (null = nothing chosen) */
  selectedDate: { [hotelId: string]: Date | null } = {};

  /** Tracks in-flight booking requests per hotel */
  bookingInProgress: { [hotelId: string]: boolean } = {};

  /**
   * Pre-built date-filter functions keyed by hotelId.
   * Rebuilt after each successful booking so removed dates are greyed out.
   */
  dateFilters: { [hotelId: string]: (d: Date | null) => boolean } = {};

  constructor(
    private bookingService: BookingService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.bookingService.getHotels().subscribe({
      next: (hotels) => {
        this.hotels = hotels;
        this.loading = false;
        hotels.forEach((h) => this.buildFilter(h));
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load hotels.', 'Close', { duration: 3000 });
      },
    });
  }

  // ── Datepicker helper ─────────────────────────────────────────────────────

  /** Returns the earliest available date for a hotel (used as [min] on picker). */
  minDate(hotel: Hotel): Date | null {
    if (!hotel.availableDates.length) return null;
    return new Date(hotel.availableDates[0]);
  }

  /** Returns the latest available date for a hotel (used as [max] on picker). */
  maxDate(hotel: Hotel): Date | null {
    if (!hotel.availableDates.length) return null;
    return new Date(hotel.availableDates[hotel.availableDates.length - 1]);
  }

  // ── Booking ───────────────────────────────────────────────────────────────

  book(hotel: Hotel): void {
    const dateObj = this.selectedDate[hotel.id];
    if (!dateObj) return;

    const date = this.toIsoDate(dateObj);
    this.bookingInProgress[hotel.id] = true;

    this.bookingService.bookHotel(hotel.id, date).subscribe({
      next: (res) => {
        this.bookingInProgress[hotel.id] = false;

        const msg = res.success
          ? `Your booking for Hotel ${hotel.name} is successful`
          : 'Please try again!!';

        this.snackBar.open(msg, 'Close', {
          duration: 5000,
          panelClass: res.success ? ['snack-success'] : ['snack-error'],
        });

        if (res.success) {
          // Remove booked date and rebuild the filter so calendar updates
          hotel.availableDates = hotel.availableDates.filter((d) => d !== date);
          delete this.selectedDate[hotel.id];
          this.buildFilter(hotel);
        }
      },
      error: () => {
        this.bookingInProgress[hotel.id] = false;
        this.snackBar.open('Please try again!!', 'Close', {
          duration: 5000,
          panelClass: ['snack-error'],
        });
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  // ── Private ───────────────────────────────────────────────────────────────

  /**
   * Builds a MatDatepickerFilter for a hotel.
   * Only dates present in hotel.availableDates return true (enabled).
   */
  private buildFilter(hotel: Hotel): void {
    const available = new Set(hotel.availableDates);
    this.dateFilters[hotel.id] = (d: Date | null): boolean => {
      if (!d) return false;
      return available.has(this.toIsoDate(d));
    };
  }

  /** Converts a local Date to "YYYY-MM-DD" without timezone shifting. */
  private toIsoDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
