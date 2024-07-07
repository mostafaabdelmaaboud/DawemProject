import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsReportsService {
  constructor(private http: HttpClient) { }
  GetEmployeeDailyAttendanceGroupByDayPath(filter: any): Observable<Blob> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.post(`${environment.baseUrl}Report/GetEmployeeDailyAttendanceGroupByDay`,{}, { params: queryParams, responseType: 'blob' })
  }
}
