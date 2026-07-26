import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CustomizationInquiry } from '../interfaces/inquiry.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  submitInquiry(inquiry: CustomizationInquiry): Observable<{ success: boolean; message: string }> {
    // Replace with: return this.http.post<...>(`${this.baseUrl}/inquiries`, inquiry);
    console.log('Inquiry submitted:', inquiry);
    return of({ success: true, message: 'Your inquiry has been received. We will contact you within 24 hours.' });
  }
}
