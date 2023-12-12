import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { ToastService } from '../../services/toast.service';
@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public toastService: ToastService) { }

  ngOnInit(): void {
  }

  getClassName(type:string){
    switch (type) {
      case 'success':
        return 'success';
        break;
    
      default:
        return 'info';
        break;
    }
  }

}
