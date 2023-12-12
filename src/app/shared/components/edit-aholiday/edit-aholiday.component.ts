import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
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

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  addBranchesInputsProps: addBranchesInputsProps[],
  labelRadioButtonFirst: string;
  firstRadio: string;

  titleHolidayName: string;
  placeholdeHolidayName: string;
  validationtitleHolidayName: string;
  titleCalendarFirst: string;
  placeholderCalendarFirst: string;
  validationCalendarFirst: string;
  titleCalendarSecond: string;
  placeholderCalendarSecond: string;
  validationCalendarSecond: string;

  secondRadio: string;
  titleClose: string;
  placeholderCalendar: string;
  titleNotes: string;
  placeholdeNotes: string;
  validationtitleNotes: string;
  message: string,
  title: string;
  type: string,
  buttonSend: string,
  code: string;
  buttonClose: string,

}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-edit-aholiday',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './edit-aholiday.component.html',
  styleUrls: ['./edit-aholiday.component.scss']
})
export class EditAholidayComponent {

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() listFirst: any[] = [
    { name: "احمد علي", key: "1" },
    { name: "محسن سيد", key: "2" },
    { name: "علي رجب", key: "3" },
    { name: "شوقي رجب", key: "4" }

  ];
  @Input() list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }

  ];
  addBranchGroupForm: FormGroup = this.fb.group({
    frstRadios: ['first'],
    holidayName: [''],
    calendarFirst: [''],
    calendarSecond: [''],
    notes: ['', Validators.required]
  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<EditAholidayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    if (this.data?.code) {
      this.addBranchGroupForm.get("fieldDisabled")?.setValue(this.data?.code);
    }

  }
  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }

  request() {
    this.submitClicked.emit(this.addBranchGroupForm.value);

    if (this.addBranchGroupForm.valid) {
      this.submitted = false;
      this.submitClicked.emit(this.addBranchGroupForm.value);
      // this.dialogRef.close(true);
    } else {
      this.getControl("branchName")?.markAsDirty();
      this.getControl("address")?.markAsDirty();
      this.getControl("phone")?.markAsDirty();

    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
