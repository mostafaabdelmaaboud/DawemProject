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
  GetEmployeeDailyAttendanceGroupByDayPath(filter: any) {
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
    return fetch(`${environment.baseUrl}EmployeeDailyAttendanceGroupByDay/GetEmployeeDailyAttendanceGroupByDay?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
    // return this.http.post(`${environment.baseUrl}EmployeeDailyAttendanceGroupByDay/GetEmployeeDailyAttendanceGroupByDay`,{}, { params: queryParams, responseType: 'blob' })
  }
  getLateEarlyArrivalGroupByDepartmentReport(filter: any): any {
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
    return fetch(`${environment.baseUrl}LateEarlyArrivalGroupByDepartment/GetLateEarlyArrivalGroupByDepartmentReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getEmployeeAttendanceByDepartmentReport(filter: any):any {
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
    return fetch(`${environment.baseUrl}EmployeeAttendanceByDepartmentEmployeeAttendanceByDepartment/GetEmployeeAttendanceByDepartmentReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getAttendaceLeaveStatusShortGroupByJobReport(filter: any): any {
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
    return fetch(`${environment.baseUrl}AttendaceLeaveStatusShortGroupByJob/GetAttendaceLeaveStatusShortGroupByJobReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getAttendanceDetailsByEmployeeIDReport(filter: any): any {
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
    return fetch(`${environment.baseUrl}AttendanceDetailsByEmployeeID/GetAttendanceDetailsByEmployeeIDReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }


  // الحضور مبكرا او متأخرا بالموظفين
  getLateEarlyArrivalGroupByEmployeeReport(filter: any): any {
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
    return fetch(`${environment.baseUrl}LateEarlyArrivalGroupByEmployee/GetLateEarlyArrivalGroupByEmployeeReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  // غياب الموظفين فى فتره 
  getEmployeeAbsenseInPeriodGroupByEmployeeReport(filter: any): any{
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
    return fetch(`${environment.baseUrl}EmployeeAbsenseInPeriodGroupByEmployee/GetEmployeeAbsenseInPeriodGroupByEmployeeReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  // غياب الموظفين فى فتره بالقسم
  getEmployeeAbsenseInPeriodGroupByDepartmentReport(filter: any): any {
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
    return fetch(`${environment.baseUrl}EmployeeAbsenseInPeriodGroupByDepartment/GetEmployeeAbsenseInPeriodGroupByDepartmentReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  // الوقت الاضافى فى فتره
  getOverTimeInSelectedPeriodReport(filter: any): any {
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
    return fetch(`${environment.baseUrl}OverTimeInSelectedPeriod/GetOverTimeInSelectedPeriodReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  // ملخص الحضور والانصراف
  getAttendaceLeaveSummaryReport(filter: any): any {
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
    return fetch(`${environment.baseUrl}AttendaceLeaveSummary/GetAttendaceLeaveSummaryReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
}
