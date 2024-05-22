import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';


interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  addBranchesInputsProps: addBranchesInputsProps[],
  message: string,
  title: string;
  titleReasonOfRefuse: string;
  placeholdeReasonOfRefuse: string;
  titleClose: string;
  type: string,
  buttonSend: string,
  buttonClose: string,
  refrenceId?: string,
  subTitle?: string
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-dialog-approve-with-date',
  standalone: true,
  imports: [CommonModule,FormsModule, TranslateModule, InputTextModule, ReactiveFormsModule, CalendarModule],
  templateUrl: './dialog-approve-with-date.component.html',
  styleUrls: ['./dialog-approve-with-date.component.scss']
})
export class DialogApproveWithDateComponent {

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted: boolean =true;;
  @Input() list: any[] = [];
  @Input() companyName: any = "";
  @Input() planName: any = "";
  activationStartDate:FormGroup = this.fb.group({
    activationStart:["", Validators.required]
  })

  constructor(
    public dialogRef: MatDialogRef<DialogApproveWithDateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
  }

  getControl(formControl) {
    return this.activationStartDate.get(formControl);
  }
  request() {
    if (this.activationStartDate.get("activationStart")?.valid && this.submitted) {
      this.submitClicked.emit(this.activationStartDate?.value);

    } else {
      this.activationStartDate.get("activationStart")?.markAsDirty();
    }


  }
  close(): void {
    this.dialogRef.close(false);
  }
}
