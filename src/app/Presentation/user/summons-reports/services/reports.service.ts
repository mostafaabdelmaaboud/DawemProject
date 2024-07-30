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
  getSummonsDetailsGroupByEmployeeReport(filter: any): any {
    let queryParams = new HttpParams();
    if (filter) {
      
      Object.entries(filter).forEach(([key, value]: any) => {
        if (key === "EmployeeIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams = queryParams.append(key, report.key)
              });
            } else {
              queryParams = queryParams.set(key, 0)
            }
          }
        } else if (key === "NotifiyWay") {
          if (value != "") {
            queryParams = queryParams.set(key, value.key)

          }        
        } else if (key === "DepartmentIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =  queryParams.append(key, report.key)
              });
            } else {
              queryParams = queryParams.set(key, 0)

            }          }
        } else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          
          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
      }
        }else if (key === "DateTo") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

          }

        }else if (key === "AllowedTimeWithMinutesFrom") {
          if (value != null) {
            queryParams = queryParams.set(key,value)

          }

        }else if (key === "AllowedTimeWithMinutesTo") {
          if (value != null) {
            queryParams = queryParams.set(key,value)

          }
        }else if (key === "DoneStatus") {
          queryParams =queryParams.set(key, value)
        }
        else {
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
    return fetch(`${environment.baseUrl}SummonsDetailsGroupByEmployee/GetSummonsDetailsGroupByEmployeeReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getSummonsDetailsInPeriodReport(filter: any): any {
    let queryParams = new HttpParams();
    if (filter) {
      
      Object.entries(filter).forEach(([key, value]: any) => {
        if (key === "EmployeeIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams = queryParams.append(key, report.key)
              });
            } else {
              queryParams = queryParams.set(key, 0)
            }
          }
        } else if (key === "NotifiyWay") {
          if (value != "") {
            queryParams = queryParams.set(key, value.key)

          }
        
        } else if (key === "DepartmentIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =  queryParams.append(key, report.key)
              });
            } else {
              queryParams = queryParams.set(key, 0)

            }          }
        } else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          
          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
      }
        }else if (key === "DateTo") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

          }

        }else if (key === "AllowedTimeWithMinutesFrom") {
          if (value != null) {
            queryParams = queryParams.set(key,value)

          }

        }else if (key === "AllowedTimeWithMinutesTo") {
          if (value != null) {
            queryParams = queryParams.set(key,value)

          }
        }
        else {
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
    return fetch(`${environment.baseUrl}SummonsDetailsInPeriod/GetSummonsDetailsInPeriodReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getBriefingSummonsInPeriodReport(filter: any): any {
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
        } else if (key === "ZoneIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        } else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          
          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
      }
        }else if (key === "DateTo") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

          }

        }else if (key === "AllowedTimeWithMinutesFrom") {
          if (value != null) {
            queryParams = queryParams.set(key,value)

          }

        }else if (key === "AllowedTimeWithMinutesTo") {
          if (value != null) {
            queryParams = queryParams.set(key,value)

          }
        }
        else if (key === "NoOfRequiredEmployeeFrom") {
          if (value != null) {
            queryParams = queryParams.set(key,value)

          }

        }else if (key === "NoOfRequiredEmployeeTo") {
          if (value != null) {
            queryParams = queryParams.set(key,value)

          }
        }else if (key === "PercentageOfDoneFrom") {
          if (value != null) {
            queryParams = queryParams.set(key,value)

          }

        }else if (key === "PercentageOfDoneTo") {
          if (value != null) {
            queryParams = queryParams.set(key,value)

          }
        }
        else {
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
    return fetch(`${environment.baseUrl}SummonsDetailsInPeriod/GetSummonsDetailsInPeriodReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
}
