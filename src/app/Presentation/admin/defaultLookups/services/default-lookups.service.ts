import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DefaultLookupsService {
  constructor(private http: HttpClient) { }

  getVacationTypes(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultVacationType/Get`, { params: queryParams })
  }
  getJobTitles(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultJobTitles/Get`, { params: queryParams })
  }
  getDepartments(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultDepartments/Get`, { params: queryParams })
  }
  getOfficialHoliday(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultOfficialHoliday/Get`, { params: queryParams })
  }
  getTaskType(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultTaskType/Get`, { params: queryParams })
  }
  getPermissionType(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultPermissionType/Get`, { params: queryParams })
  }
  getJustificationType(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultJustificationType/Get`, { params: queryParams })
  }
  getShiftType(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultShiftType/Get`, { params: queryParams })
  }
  getPenalties(filter: any): Observable<any> {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultPenalties/Get`, { params: queryParams })
  }
  getInformation(): Observable<any> {

    return this.http.get<any>(`${environment.baseUrl}adminpanel/Plan/GetPlansInformations`).pipe(map(data => data.data));
  }
  getLanguages(filter: any) {
    let queryParams = new HttpParams();
    if (filter) {
      Object.entries(filter).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/Lookups/GetLanguages`, { params: queryParams }).pipe(map(data => data.data))
  }
  deleteVacationType(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}adminpanel/DefaultVacationType/delete`, { params: queryParams })
  }
  deleteJobTitles(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}adminpanel/DefaultJobTitles/delete`, { params: queryParams })
  }
  deleteDepartments(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}adminpanel/DefaultDepartments/delete`, { params: queryParams })
  }
  deleteOfficialHoliday(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}adminpanel/DefaultOfficialHoliday/delete`, { params: queryParams })
  }
  deleteTaskType(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}adminpanel/DefaultTaskType/delete`, { params: queryParams })
  }
  deletePermissionType(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}adminpanel/DefaultPermissionType/delete`, { params: queryParams })
  }
  deleteJustificationType(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}adminpanel/DefaultJustificationType/delete`, { params: queryParams })
  }
  deleteShiftType(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}adminpanel/DefaultShiftType/delete`, { params: queryParams })
  }
  deletePenalties(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.delete<any>(`${environment.baseUrl}adminpanel/DefaultPenalties/delete`, { params: queryParams })
  }
  acceptVacationType(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultVacationType/enable`, {}, { params: queryParams })

  }
  acceptDepartments(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultDepartments/enable`, {}, { params: queryParams })

  }
  acceptJobTitles(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultJobTitles/enable`, {}, { params: queryParams })

  }
  acceptOfficialHoliday(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultOfficialHoliday/enable`, {}, { params: queryParams })

  }
  acceptTaskType(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultTaskType/enable`, {}, { params: queryParams })
  }
  acceptPermissionType(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultPermissionType/enable`, {}, { params: queryParams })
  }
  acceptJustificationType(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultJustificationType/enable`, {}, { params: queryParams })
  }
  acceptShiftType(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultShiftType/enable`, {}, { params: queryParams })
  }
  acceptPenalties(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultPenalties/enable`, {}, { params: queryParams })
  }
  createVacationType(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/DefaultVacationType/Create`, formData)

  }
  createJobTitles(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/DefaultJobTitles/Create`, formData)

  }
  createDepartments(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/DefaultDepartments/Create`, formData)

  }
  createOfficialHoliday(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/DefaultOfficialHoliday/Create`, formData)

  }
  createTaskType(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/DefaultTaskType/Create`, formData)

  }
  createPermissionType(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/DefaultPermissionType/Create`, formData)

  }
  createJustificationType(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/DefaultJustificationType/Create`, formData)

  }
  createShiftType(formData: any) {

    return this.http.post<any>(`${environment.baseUrl}adminpanel/DefaultShiftType/Create`, formData)
  }
  createPenalties(formData: any) {
    return this.http.post<any>(`${environment.baseUrl}adminpanel/DefaultPenalties/Create`, formData)
  }
  updateVacationType(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultVacationType/Update`, formData)

  }
  updateJobTitles(formData: FormData) {

    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultJobTitles/Update`, formData)

  }
  updateDepartments(formData: FormData) {
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultDepartments/Update`, formData)
  }
  updateOfficialHoliday(formData: FormData) {
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultOfficialHoliday/Update`, formData)
  }
  updateTaskType(formData: FormData) {
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultTaskType/Update`, formData)
  }
  updatePermissionType(formData: FormData) {
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultPermissionType/Update`, formData)
  }
  updateJustificationType(formData: FormData) {
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultJustificationType/Update`, formData)
  }
  updateShiftType(formData: FormData) {
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultShiftType/Update`, formData)
  }
  updatePenalties(formData: FormData) {
    return this.http.put<any>(`${environment.baseUrl}adminpanel/DefaultPenalties/Update`, formData)
  }
  vacationTypeGetById(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultVacationType/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  jobTitlesGetById(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultJobTitles/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  departmentsGetById(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultDepartments/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  officialHolidayGetById(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultOfficialHoliday/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  taskTypeGetById(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultTaskType/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  permissionTypeGetById(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultPermissionType/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  justificationTypeGetById(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultJustificationType/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  shiftTypeGetById(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultShiftType/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }
  penaltiesGetById(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultPenalties/GetById`, { params: queryParams }).pipe(map(data => data.data))
  }


  vacationTypeInfo(params: any) {
    let queryParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultVacationType/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  jobTitlesInfo(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultJobTitles/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  departmentsInfo(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultDepartments/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  officialHolidayInfo(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultOfficialHoliday/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  taskTypeInfo(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultTaskType/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  permissionTypeInfo(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultPermissionType/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  justificationTypeInfo(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultJustificationType/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  shiftTypeInfo(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultShiftType/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
  penaltiesInfo(params: any) {
    let queryParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]: any) => {
        queryParams = queryParams.set(key, value);
      })
    }
    return this.http.get<any>(`${environment.baseUrl}adminpanel/DefaultPenalties/GetInfo`, { params: queryParams }).pipe(map(data => data.data))
  }
}
