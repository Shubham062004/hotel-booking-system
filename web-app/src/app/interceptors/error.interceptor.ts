import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

/**
 * Global HTTP error interceptor.
 *
 * 0   → network / server unreachable
 * 401 → token missing or expired → clear storage, redirect to login
 * 403 → authenticated but not authorised → redirect to login
 * 409 → business conflict (double booking etc.) → let components handle it
 * 5xx → generic server error → snackbar
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router   = inject(Router);
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 0:
          snackBar.open(
            'Cannot reach the server. Check your connection.',
            'Close',
            { duration: 5000 }
          );
          break;

        case 401:
          localStorage.removeItem('hotel_jwt');
          localStorage.removeItem('hotel_role');
          router.navigate(['/login']);
          break;

        case 403:
          snackBar.open('Access denied.', 'Close', { duration: 3000 });
          router.navigate(['/login']);
          break;

        case 409:
          // Conflict (date already booked) — components display their own message
          break;

        default:
          if (error.status >= 500) {
            snackBar.open(
              'Server error. Please try again later.',
              'Close',
              { duration: 5000 }
            );
          }
          break;
      }

      // Always rethrow so component-level error handlers still run
      return throwError(() => error);
    })
  );
};
