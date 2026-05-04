import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
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
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  templateUrl: './hotel-list.component.html',
  styleUrl: './hotel-list.component.scss',
})
export class HotelListComponent implements OnInit {
  hotels: Hotel[] = [];
  loading = true;
  selectedDate: { [hotelId: string]: string } = {};
  bookingInProgress: { [hotelId: string]: boolean } = {};

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
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load hotels.', 'Close', { duration: 3000 });
      },
    });
  }

  book(hotel: Hotel): void {
    const date = this.selectedDate[hotel.id];
    if (!date) return;

    this.bookingInProgress[hotel.id] = true;

    this.bookingService.bookHotel(hotel.id, date).subscribe({
      next: (res) => {
        this.bookingInProgress[hotel.id] = false;
        this.snackBar.open(res.message, 'Close', {
          duration: 4000,
          panelClass: res.success ? ['snack-success'] : ['snack-error'],
        });
        if (res.success) {
          hotel.availableDates = hotel.availableDates.filter((d) => d !== date);
          delete this.selectedDate[hotel.id];
        }
      },
      error: (err) => {
        this.bookingInProgress[hotel.id] = false;
        this.snackBar.open(
          err.error?.message ?? 'Booking failed.',
          'Close',
          { duration: 4000, panelClass: ['snack-error'] }
        );
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
