import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) { }
  GetEmployeeDailyAttendanceGroupByDayPath(filter: any): Observable<Blob> {
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
        } else if (key === "DepartmentIds") {
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
        }else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
     }
        }else if (key === "DateTo") {
          queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

        }else {
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
    return this.http.post(`${environment.baseUrl}EmployeeDailyAttendanceGroupByDay/GetEmployeeDailyAttendanceGroupByDay`,{}, { params: queryParams, responseType: 'blob' })
  }
  getLateEarlyArrivalGroupByDepartmentReport(filter: any): Observable<Blob> {
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
        } else if (key === "DepartmentIds") {
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
        }else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
     }
        }else if (key === "DateTo") {
          queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

        }else {
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
    return this.http.post(`${environment.baseUrl}LateEarlyArrivalGroupByDepartment/GetLateEarlyArrivalGroupByDepartmentReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  getEmployeeAttendanceByDepartmentReport(filter: any): Observable<Blob> {
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
        } else if (key === "DepartmentIds") {
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
        }else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
     }
        }else if (key === "DateTo") {
          queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

        }else {
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
    return this.http.post(`${environment.baseUrl}EmployeeAttendanceByDepartmentEmployeeAttendanceByDepartment/GetEmployeeAttendanceByDepartmentReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  getAttendaceLeaveStatusShortGroupByJobReport(filter: any): Observable<Blob> {
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
        } else if (key === "DepartmentIds") {
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
        }else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
     }
        }else if (key === "DateTo") {
          queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

        }else {
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
    return this.http.post(`${environment.baseUrl}AttendaceLeaveStatusShortGroupByJob/GetAttendaceLeaveStatusShortGroupByJobReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  getAttendanceDetailsByEmployeeIDReport(filter: any): Observable<Blob> {
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
        } else if (key === "DepartmentIds") {
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
        }else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
     }
        }else if (key === "DateTo") {
          queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

        }else {
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
    return this.http.post(`${environment.baseUrl}AttendanceDetailsByEmployeeID/GetAttendanceDetailsByEmployeeIDReport`,{}, { params: queryParams, responseType: 'blob' })
  }


  // الحضور مبكرا او متأخرا بالموظفين
  getLateEarlyArrivalGroupByEmployeeReport(filter: any): Observable<Blob> {
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
        } else if (key === "DepartmentIds") {
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
        }else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
     }
        }else if (key === "DateTo") {
          queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

        }else {
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
    return this.http.post(`${environment.baseUrl}LateEarlyArrivalGroupByEmployee/GetLateEarlyArrivalGroupByEmployeeReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  // غياب الموظفين فى فتره 
  getEmployeeAbsenseInPeriodGroupByEmployeeReport(filter: any): Observable<Blob> {
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
        } else if (key === "DepartmentIds") {
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
        }else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
     }
        }else if (key === "DateTo") {
          queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

        }else {
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
    return this.http.post(`${environment.baseUrl}EmployeeAbsenseInPeriodGroupByEmployee/GetEmployeeAbsenseInPeriodGroupByEmployeeReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  // غياب الموظفين فى فتره بالقسم
  getEmployeeAbsenseInPeriodGroupByDepartmentReport(filter: any): Observable<Blob> {
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
        } else if (key === "DepartmentIds") {
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
        }else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
     }
        }else if (key === "DateTo") {
          queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

        }else {
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
    return this.http.post(`${environment.baseUrl}EmployeeAbsenseInPeriodGroupByDepartment/GetEmployeeAbsenseInPeriodGroupByDepartmentReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  // الوقت الاضافى فى فتره
  getOverTimeInSelectedPeriodReport(filter: any): Observable<Blob> {
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
        } else if (key === "DepartmentIds") {
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
        }else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
     }
        }else if (key === "DateTo") {
          queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

        }else {
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
    return this.http.post(`${environment.baseUrl}OverTimeInSelectedPeriod/GetOverTimeInSelectedPeriodReport`,{}, { params: queryParams, responseType: 'blob' })
  }
  // ملخص الحضور والانصراف
  getAttendaceLeaveSummaryReport(filter: any): Observable<Blob> {
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
        } else if (key === "DepartmentIds") {
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
        }else if (key === "JobTitleIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        } else if (key === "DateFrom") {
          if (value != "") {
            queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))
      }
        }else if (key === "DateTo") {
          queryParams = queryParams.set(key, moment(value).format("MM/DD/YYYY"))

        }else {
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
    return this.http.post(`${environment.baseUrl}AttendaceLeaveSummary/GetAttendaceLeaveSummaryReport`,{}, { params: queryParams, responseType: 'blob' })
  }
}
