import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient) { }
  getStatisticsOverAperiodReport(filter: any): any {
    let queryParams = new HttpParams();
    if (filter) {
      
      Object.entries(filter).forEach(([key, value]: any) => {
         if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
        }
        }else if (key === "DateTo") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

          }

        }else if (key === "OrderBy") {
          if (value != "") {
            queryParams = queryParams.set(key, value)

          }
        }  else {
          if (typeof value  === 'string') {
            if(value != "") {
              queryParams = queryParams.set(key, value.trim())
            }
          } else {
            if(value >=0) {
              queryParams = queryParams.set(key, value)
            }
    
          }
        }
  
      });
    }
    return fetch(`${environment.baseUrl}StatisticsOverAperiod/GetStatisticsOverAperiodReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getStatisticsReportOverAperiodByDepartmentReport(filter: any): any {
    let queryParams = new HttpParams();
    if (filter) {
      
      Object.entries(filter).forEach(([key, value]: any) => {
         if (key === "DepartmentIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =  queryParams.append(key, report.key)
              });
            } else {
              queryParams = queryParams.set(key, 0)

            }          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
      }
        }else if (key === "DateTo") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

          }

        } else if (key === "OrderBy") {
          if (value != "") {
            queryParams = queryParams.set(key, value)

          }
        }  else {
          if (typeof value  === 'string') {
            if(value != "") {
              queryParams = queryParams.set(key, value.trim())
            }
          } else {
            if(value >=0) {
              queryParams = queryParams.set(key, value)
            }
    
          }
        }
  
      });
    }
    return fetch(`${environment.baseUrl}StatisticsReportOverAperiodByDepartment/GetStatisticsReportOverAperiodByDepartmentReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getStatisticsReportOverAperiodGroupByMonthReport(filter: any): any {
    let queryParams = new HttpParams();
    if (filter) {
      
      Object.entries(filter).forEach(([key, value]: any) => {
         if (key === "DepartmentIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =  queryParams.append(key, report.key)
              });
            } else {
              queryParams = queryParams.set(key, 0)

            }          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
      }
        }else if (key === "DateTo") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

          }

        } else if (key === "OrderBy") {
          if (value != "") {
            queryParams = queryParams.set(key, value)

          }
        }  else {
          if (typeof value  === 'string') {
            if(value != "") {
              queryParams = queryParams.set(key, value.trim())
            }
          } else {
            if(value >=0) {
              queryParams = queryParams.set(key, value)
            }
    
          }
        }
  
      });
    }
    return fetch(`${environment.baseUrl}StatisticsReportOverAperiodGroupByMonth/GetStatisticsReportOverAperiodGroupByMonthReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
}
