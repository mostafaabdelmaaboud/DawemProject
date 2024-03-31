import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
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
import { CheckboxModule } from 'primeng/checkbox';
import * as moment from 'moment';
import { PrimeNGConfig } from 'primeng/api';
import uq from '@umalqura/core';

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
  titleName: string;
  placeholdeName: string;
  validationtitleName: string;
  setAsActive: string;
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
  imports: [CommonModule, FormsModule, MatRadioModule, CheckboxModule, MatProgressSpinnerModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  providers:[DatePipe],
  templateUrl: './add-aholiday.component.html',
  styleUrls: ['./add-aholiday.component.scss']
})
export class AddAholidayComponent {
  loading = false;
  selectedDate!: Date;

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() listFirst: any[] = [];
  @Input() list: any[] = [];
  @Input() editHoliday!: boolean;

  addBranchGroupForm: FormGroup = this.fb.group({
    name: ["", Validators.required],
    isActive: [false],
    dateType: ['0'],
    startDate: ['', [Validators.required, this.startDateValidator("endDate")]],
    endDate: ['', [Validators.required, this.endDateValidator("startDate")]],
    isSpecifiedByYear: [false],
    notes: ['', Validators.required]
  });
  private holidaysService = inject(HolidaysService);
  @Input() id!: boolean;
  dateFormat: string = 'mm/dd/yy';
  hijriLocale = {
    dayNames: [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت"
    ],
    dayNamesShort: [
      "أحد",
      "اثنين",
      "ثلاثاء",
      "أربعاء",
      "خميس",
      "جمعة",
      "سبت"
    ],
    dayNamesMin: [
      "ح",
      "ن",
      "ث",
      "ر",
      "خ",
      "ج",
      "س"
    ],
    monthNames: [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر"
    ],
    monthNamesShort: [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر"
    ],
    am: "صباحًا",
    pm: "مساءً",
    today: "اليوم",
    weekHeader: "الأسبوع",
    clear: "مسح"
  }
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<AddAholidayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private config: PrimeNGConfig,
    private datePipe: DatePipe,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
    this.selectedDate = new Date();

  }
  convertToHijri(selectedDate: Date): any {
    const formattedDate = this.datePipe.transform(selectedDate, 'yyyy-MM-dd', 'gregorian');
    return formattedDate; // يجب أن يكون التاريخ بالتنسيق الميلادي (yyyy-MM-dd)
  }
  onDateSelect(selectedDate: Date): void {
    const hijriDate = this.convertToHijri(selectedDate);
    console.log('Hijri Date:', hijriDate);
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.addBranchGroupForm.get("dateType")?.valueChanges.subscribe(data => {

      if (data === "0") {
        this.hijriLocale = {
          dayNames: [
            "الأحد",
            "الاثنين",
            "الثلاثاء",
            "الأربعاء",
            "الخميس",
            "الجمعة",
            "السبت"
          ],
          dayNamesShort: [
            "أحد",
            "اثنين",
            "ثلاثاء",
            "أربعاء",
            "خميس",
            "جمعة",
            "سبت"
          ],
          dayNamesMin: [
            "ح",
            "ن",
            "ث",
            "ر",
            "خ",
            "ج",
            "س"
          ],
          monthNames: [
            "يناير",
            "فبراير",
            "مارس",
            "أبريل",
            "مايو",
            "يونيو",
            "يوليو",
            "أغسطس",
            "سبتمبر",
            "أكتوبر",
            "نوفمبر",
            "ديسمبر"
          ],
          monthNamesShort: [
            "يناير",
            "فبراير",
            "مارس",
            "أبريل",
            "مايو",
            "يونيو",
            "يوليو",
            "أغسطس",
            "سبتمبر",
            "أكتوبر",
            "نوفمبر",
            "ديسمبر"
          ],
          am: "صباحًا",
          pm: "مساءً",
          today: "اليوم",
          weekHeader: "الأسبوع",
          clear: "مسح"
        }
        this.config.setTranslation(this.hijriLocale);
        this.getControl("startDate")?.reset();
        this.getControl("endDate")?.reset();
        this.dateFormat ='mm/dd/yy';
        this.selectedDate = new Date();

      } else {

        this.hijriLocale = {
          dayNames: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
          dayNamesShort: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
          dayNamesMin: ["أح", "إث", "ثل", "أر", "خم", "جم", "سب"],
          monthNames: ["محرّم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"],
          monthNamesShort: ["محرّم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة", "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"],
          am: "صباحًا",
          pm: "مساءً",
          today: "اليوم",
          weekHeader: "الأسبوع",
          clear: "مسح"
        }
        this.config.setTranslation(this.hijriLocale);
        this.dateFormat ='dd MM';

        this.getControl("startDate")?.reset();
        this.getControl("endDate")?.reset();
        const today = new Date();
        const d = uq(today);    
        this.selectedDate = new Date(d.hy, d.hm - 1, d.hd);
        

      }
    })
    if (this.data?.code) {
      this.addBranchGroupForm.get("fieldDisabled")?.setValue(this.data?.code);
    }
    if (this.editHoliday) {
      this.holidaysService.holidayGetById({ holidayId: this.id }).subscribe(
        {
          next: data => {

            this.getControl("isActive")?.setValue(data.isActive);
            this.getControl("notes")?.setValue(data.notes);
            this.getControl("name")?.setValue(data.name);
            this.getControl("dateType")?.setValue(data.dateType.toString());
            this.getControl("startDate")?.setValue(new Date(data.startDate));
            this.getControl("endDate")?.setValue(new Date(data.endDate));
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
  startDateValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: any = control.value;
      let checkMin = true;
      if (value != "") {
        if (
          this.addBranchGroupForm?.get(conInput)?.dirty &&
          !this.addBranchGroupForm?.get(conInput)?.hasError("required")
        ) {
          if (value > this.addBranchGroupForm?.get(conInput)?.value) {
            checkMin = false;
          }
        }
      }
      // const hasNumber = /\d/.test(value);
      return checkMin ? null : { dateRangeError: true };
    };
  }
  endDateValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: any = control.value;
      let checkMin = true;

      if (value != null) {
        if (
          this.addBranchGroupForm?.get(conInput)?.dirty &&
          !this.addBranchGroupForm?.get(conInput)?.hasError("required")
        ) {
          if (value < this.addBranchGroupForm?.get(conInput)?.value) {
            checkMin = false;
          }
        }

      }
      // const hasNumber = /\d/.test(value);
      return checkMin ? null : { dateRangeError: true };
    };
  }
  request() {

    if (this.addBranchGroupForm.valid) {
      this.submitted = false;
      this.submitClicked.emit(this.addBranchGroupForm.value);
      // this.dialogRef.close(true);
    } else {

      this.getControl("name")?.markAsDirty();
      this.getControl("startDate")?.markAsDirty();
      this.getControl("endDate")?.markAsDirty();
      this.getControl("notes")?.markAsDirty();
    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
