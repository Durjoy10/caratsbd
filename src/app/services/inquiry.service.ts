import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { CustomizationInquiry } from '../interfaces/inquiry.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseLink}${environment.ftpPrefix}`;

  submitInquiry(inquiry: CustomizationInquiry): Observable<{ message: string; data: any }> {
    return this.http.post<{ message: string; data: any }>(`${this.baseUrl}/inquiries`, inquiry).pipe(
      tap(() => {
        // Inquiry sent successfully
      }),
      catchError((err) => {
        console.error('Inquiry submission failed:', err);
        return throwError(() => err);
      })
    );
  }
}
