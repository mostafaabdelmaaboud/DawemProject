import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UpdateCompanyService {

  constructor(private http: HttpClient) { }
  getCompany(): Observable<any> {
    // let queryParams = new HttpParams();
    // if (filter) {
    //   Object.entries(filter).forEach(([key, value]: any) => {
    //     queryParams = queryParams.set(key, value);
    //   })
    // }
    return this.http.get<any>(`${environment.baseUrl}Company/GetById`).pipe(map(data => data.data));
  }
  updateCompany(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}Company/Update`, formData)

  }
}
