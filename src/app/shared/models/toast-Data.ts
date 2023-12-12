
export interface ToastData {
    message: string;
    type: avilableTypes;
  }

export enum avilableTypes{
    Success = 'success',
    Info = 'info',
    Warning = 'warning',
    Error = 'Error',
}