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
import { HolidaysService } from 'src/app/Presentation/user/holidays/services/holidays.service';

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
  selector: 'app-add-aholiday',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-aholiday.component.html',
  styleUrls: ['./add-aholiday.component.scss']
})
export class AddAholidayComponent {
  loading = false;

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() listFirst: any[] = [];
  @Input() list: any[] = [];
  @Input() editHoliday!: boolean;

  addBranchGroupForm: FormGroup = this.fb.group({
    frstRadios: ['0'],
    holidayName: [''],
    calendarFirst: [''],
    calendarSecond: [''],
    notes: ['', Validators.required]
  });
  private holidaysService = inject(HolidaysService);
  @Input() id!: boolean;


  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<AddAholidayComponent>,
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
    if (this.editHoliday) {
      this.holidaysService.holidayGetById({ holidayId: this.id }).subscribe(
        {
          next: data => {

            // SchedulePlanType: ['0', Validators.required],
            //   EmployeeId: ['', Validators.required],

            //     ScheduleId: ["", Validators.required],
            //       DateFrom: ['', Validators.required],
            //         notes: ["", Validators.required],
            this.getControl("isActive")?.setValue(data.isActive);
            this.getControl("notes")?.setValue(data.notes);

            this.getControl("DateFrom")?.setValue(new Date(data.dateFrom));

            this.getControl("SchedulePlanType")?.setValue(data.schedulePlanType.toString());
            this.getControl("fieldDisabled")?.setValue(data.code);





            this.loading = false;
          },
          error: err => {
            this.loading = false;
          }
        }
      )

    }
    if (!this.editHoliday) {
      this.loading = false;

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
