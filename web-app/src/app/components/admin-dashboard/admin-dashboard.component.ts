import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Booking, Hotel } from '../../models/models';

export interface BookingRow {
  id: string;
  hotel: string;   // resolved hotel name
  date: string;
  user: string;
  amount: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  displayedColumns: string[] = ['hotel', 'date', 'user', 'amount'];
  dataSource = new MatTableDataSource<BookingRow>([]);
  loading = true;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bookingService: BookingService,
    public authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Fetch hotels + bookings in parallel, then join by hotelId → hotel name
    forkJoin({
      hotels: this.bookingService.getHotels(),
      bookings: this.bookingService.getAllBookings(),
    }).subscribe({
      next: ({ hotels, bookings }) => {
        const hotelMap = new Map<string, string>(
          hotels.map((h: Hotel) => [h.id, h.name])
        );

        const rows: BookingRow[] = bookings.map((b: Booking) => ({
          id: b.id,
          hotel: hotelMap.get(b.hotelId) ?? b.hotelId,
          date: b.date,
          user: b.username,
          amount: b.amount,
        }));

        this.dataSource.data = rows;
        this.loading = false;

        // Bind sort and paginator after data is set
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Failed to load dashboard data.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  get totalRevenue(): number {
    return this.dataSource.data.reduce((sum, r) => sum + r.amount, 0);
  }

  get totalBookings(): number {
    return this.dataSource.data.length;
  }

  logout(): void {
    this.authService.logout();
  }
}
