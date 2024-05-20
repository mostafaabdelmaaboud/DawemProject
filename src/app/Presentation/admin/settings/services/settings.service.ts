import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }
  getSettings(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}adminpanel/Setting/Get`).pipe(map(data => data.data));
  }
}
