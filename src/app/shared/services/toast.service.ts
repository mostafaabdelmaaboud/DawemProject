import { Injectable, TemplateRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastComponent } from '../components/toast/toast.component';
import { ToastData } from '../models/toast-Data';


@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];
  constructor(private snackbar: MatSnackBar) { }

  show(data: ToastData) {
    let snackBarRef = this.snackbar.openFromComponent(ToastComponent, {
      data: data, horizontalPosition: 'center',
      verticalPosition: 'bottom', panelClass: [`toast-${data.type}`, 'toast-position'], duration: 3000
    });
  }

  close() {
    this.snackbar.dismiss();
  }

}
