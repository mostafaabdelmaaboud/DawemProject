import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ShiftsService } from 'src/app/Presentation/user/shifts/services/shifts.service';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {

  titleClose: string;
  titleShift: string;
  placeholdeShift: string;
  validationtitleShift: string;
  entryTime: string;
  placeholderEntryTime: string;
  validationEntryTime: string;
  titletimeToGoOut: string;
  placeholdertimeToGoOut: string;
  validationtimeToGoOut: string;
  extraMinutes: string;
  titleFieldDisabled: string;
  placeholdeieldDisabled: string;

  placeholdeExtraMinutes: string;
  validationtitleExtraMinutes: string;
  titlePermanentType: string;
  placeholderPermanentType: string;
  validationtitlePermanentType: string;
  firstRadio: string,
  validationToGoOut: string;
  secondRadio: string;
  message: string,
  title: string;
  buttonSend: string,
  buttonClose: string,

}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-add-shift',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, ReactiveFormsModule, MatProgressSpinnerModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-shift.component.html',
  styleUrls: ['./add-shift.component.scss']
})
export class AddShiftComponent {
  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() editShift!: boolean;
  @Input() id!: string;

  addBranchGroupForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    fieldDisabled: [''],
    timePeriod: ['0'],
    checkInTime: ['', Validators.required],
    checkOutTime: ['', Validators.required],
    allowedMinutes: ['', Validators.required]
  });
  loading = false;
  private shiftsService = inject(ShiftsService);

  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<AddShiftComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.editShift) {
      this.loading = true;
      this.shiftsService.shiftsGetById({ ShiftWorkingTimeId: this.id }).subscribe(
        {
          next: data => {


            this.addBranchGroupForm.get("name")?.setValue(data.name);

            this.addBranchGroupForm.get("timePeriod")?.setValue(data.timePeriod.toString());
            const timeString = data.checkInTime;
            const timeValueone = new Date(`1970-01-01T${timeString}`);

            this.addBranchGroupForm.get("checkInTime")?.setValue(timeValueone);
            const timeStringTwo = data.checkOutTime;

            const timeValueTwo = new Date(`1970-01-01T${timeStringTwo}`);
            this.addBranchGroupForm.get("checkOutTime")?.setValue(timeValueTwo);
            this.addBranchGroupForm.get("allowedMinutes")?.setValue(data.allowedMinutes);
            this.addBranchGroupForm.get("fieldDisabled")?.setValue(data.code);


            this.loading = false;
          },
          error: err => {
            this.loading = false;
          }
        }
      )
    }

  }
  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }

  request() {

    if (this.addBranchGroupForm.valid) {
      this.submitted = false;
      this.submitClicked.emit(this.addBranchGroupForm.value);
      // this.dialogRef.close(true);
    } else {

      this.getControl("name")?.markAsDirty();
      this.getControl("checkInTime")?.markAsDirty();
      this.getControl("checkOutTime")?.markAsDirty();
      this.getControl("allowedMinutes")?.markAsDirty();

    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
