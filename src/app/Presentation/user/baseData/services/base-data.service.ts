import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class BaseDataService {

  constructor(private http: HttpClient) { }
  GetAttendanceAndDepartureForEmployeesReport(filter: any):any{
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

    return fetch(`${environment.baseUrl}AttendanceAndDepartureForEmployees/GetAttendanceAndDepartureForEmployeesReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getDepartmentsReport(filter: any): any {
    let queryParams = new HttpParams();
    if (filter) {

      Object.entries(filter).forEach(([key, value]: any) => {
 
          if (typeof value  === 'string') {
            if(value != "") {
              queryParams = queryParams.set(key, value.trim())

        
            }
          } else {
            if(value >=0) {
     
              queryParams = queryParams.set(key, value)

            }
    
          }
  
      });
    }

    return fetch(`${environment.baseUrl}Departments/GetDepartmentsReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getEmployeesReport(filter: any): any {
    let queryParams = new HttpParams();
    if (filter) {

      Object.entries(filter).forEach(([key, value]: any) => {
 
          if (typeof value  === 'string') {
            if(value != "") {
              queryParams = queryParams.set(key, value.trim())

        
            }
          } else {
            if(value >=0) {
     
              queryParams = queryParams.set(key, value)

            }
    
          }
  
      });
    }
    return fetch(`${environment.baseUrl}Employees/GetEmployeesReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getGroupsReport(filter: any): any {
    let queryParams = new HttpParams();
    if (filter) {

      Object.entries(filter).forEach(([key, value]: any) => {
 
          if (typeof value  === 'string') {
            if(value != "") {
              queryParams = queryParams.set(key, value.trim())

        
            }
          } else {
            if(value >=0) {
     
              queryParams = queryParams.set(key, value)

            }
    
          }
  
      });
    }
    return fetch(`${environment.baseUrl}Groups/GetGroupsReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getSanctionsReport(filter: any): any {
    let queryParams = new HttpParams();
    if (filter) {

      Object.entries(filter).forEach(([key, value]: any) => {
 
          if (typeof value  === 'string') {
            if(value != "") {
              queryParams = queryParams.set(key, value.trim())

        
            }
          } else {
            if(value >=0) {
     
              queryParams = queryParams.set(key, value)

            }
    
          }
  
      });
    }
    return fetch(`${environment.baseUrl}Sanctions/GetSanctionsReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getShiftsReport(filter: any): any {
    let queryParams = new HttpParams();
    if (filter) {

      Object.entries(filter).forEach(([key, value]: any) => {
 
          if (typeof value  === 'string') {
            if(value != "") {
              queryParams = queryParams.set(key, value.trim())

        
            }
          } else {
            if(value >=0) {
     
              queryParams = queryParams.set(key, value)

            }
    
          }
  
      });
    }
    return fetch(`${environment.baseUrl}Shifts/GetShiftsReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getZonesReport(filter: any): any {
    let queryParams = new HttpParams();
    if (filter) {

      Object.entries(filter).forEach(([key, value]: any) => {
 
          if (typeof value  === 'string') {
            if(value != "") {
              queryParams = queryParams.set(key, value.trim())

        
            }
          } else {
            if(value >=0) {
     
              queryParams = queryParams.set(key, value)

            }
    
          }
  
      });
    }
    return fetch(`${environment.baseUrl}Zones/GetZonesReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getVacationBalancesReport(filter: any):any{
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
    return fetch(`${environment.baseUrl}VacationBalances/GetVacationBalancesReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`,
      }
    });
  }
 
  getSummonsReport(filter: any):any {
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
        } else if (key === "GroupIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        }else if (key === "DateFrom") {
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
    return fetch(`${environment.baseUrl}Summons/GetSummonsReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }

  getSummonLogsReport(filter: any):any {
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
        } else if (key === "GroupIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        }else if (key === "DateFrom") {
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
    return fetch(`${environment.baseUrl}SummonLogs/GetSummonLogsReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getRequestsReport(filter: any):any {
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
        } else if (key === "GroupIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        }else if (key === "DateFrom") {
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
    return fetch(`${environment.baseUrl}Requests/GetRequestsReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getSchedulePlanLogsReport(filter: any):any {
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
        } else if (key === "GroupIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        }else if (key === "DateFrom") {
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
    return fetch(`${environment.baseUrl}SchedulePlanLogs/GetSchedulePlanLogsReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getSchedulesReport(filter: any):any {
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
        } else if (key === "GroupIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        }else if (key === "DateFrom") {
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
    return fetch(`${environment.baseUrl}Schedules/GetSchedulesReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  getSchedulePlansReport(filter: any):any {
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
        } else if (key === "GroupIds") {
          if (value != "") {
            if(value?.length > 0) {
              value.forEach(report => {
                queryParams =queryParams.append(key, report.key)
              });
            } else {
              queryParams =queryParams.set(key, 0)

            }          }
        }else if (key === "DateFrom") {
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
    return fetch(`${environment.baseUrl}SchedulePlans/GetSchedulePlansReport?${queryParams}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token") as string)}`
      }
    });
  }
  groupsForDropdown(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        if (key === "ids") {
          value.forEach((id: any) => {
            queryParams = queryParams.append(key, id)

          });
        } else {
          queryParams = queryParams.set(key, value);

        }
      })
    }
    return this.http.get<any>(`${environment.baseUrl}Group/GetForDropDown`, { params: queryParams })
  }
}
