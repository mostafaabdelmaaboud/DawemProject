import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { RadioButtonModule } from 'primeng/radiobutton';

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
  selector: 'app-dialog-close-radio-buttons',
  standalone: true,
  imports: [CommonModule, TranslateModule, InputTextModule,RadioButtonModule, MatProgressSpinnerModule, ReactiveFormsModule],
  templateUrl: './dialog-close-radio-buttons.component.html',
  styleUrls: ['./dialog-close-radio-buttons.component.scss']
})
export class DialogCloseRadioButtonsComponent {

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() list: any[] = [];

  dialogCloseForm: FormGroup = this.fb.group({
    type: ['0'],

  });
  constructor(
    public dialogRef: MatDialogRef<DialogCloseRadioButtonsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
  }


  request() {
    if (this.submitted) {
      this.submitClicked.emit(this.dialogCloseForm?.value);

    }


  }
  close(): void {
    this.dialogRef.close(false);
  }
}
