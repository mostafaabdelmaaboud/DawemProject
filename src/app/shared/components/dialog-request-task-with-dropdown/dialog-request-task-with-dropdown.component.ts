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
import { MultiSelectModule } from 'primeng/multiselect';
import { MatRadioModule } from '@angular/material/radio';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  addBranchesInputsProps: addBranchesInputsProps[],
  uploadFile: string;
  setAsNecessary: string;
  titleDropdownOne: string;
  placeholderDropdown: string;
  placeholderCalendar: string;
  labelRadioButton: string;
  firstRadio: string;
  secondRadio: string;
  titleDropdownFirst: string;
  placeholderDropdownFirst: string;
  validationtitleDropdownFirst: string;

  titleNotes: string;
  chooseLabel: string;
  placeholdeNotes: string;
  titleCalendar: string;
  timeAttendance: string;
  placeholdertimeAttendance: string;
  message: string,
  titleWorkTeam: string;
  placeholderWorkTeam: string,
  title: string;
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
  selector: 'app-dialog-request-task-with-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, ReactiveFormsModule, MultiSelectModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './dialog-request-task-with-dropdown.component.html',
  styleUrls: ['./dialog-request-task-with-dropdown.component.scss']
})
export class DialogRequestTaskWithDropdownComponent {

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() listFirst: any[] = [
    { name: "احمد علي", key: "1" },
    { name: "محسن سيد", key: "2" },
    { name: "علي رجب", key: "3" },
    { name: "شوقي رجب", key: "4" }

  ];
  @Input() list: any[] = [
    { name: "مقابلة عميل", key: "1" },
    { name: "مرور موقع", key: "2" },
    { name: "جهة حكومية", key: "3" },
    { name: "مهمة خاصة", key: "4" }

  ];
  @Input() workTeamList: any[] = [
    { name: "وفقي فتحي،", key: "1" },
    { name: "محمد خالد", key: "2" },
    { name: "محسن سعد", key: "3" },
    { name: "محسن احمد", key: "4" },
    { name: "علي احمد", key: "5" },
    { name: "سيد علي", key: "6" }


  ];
  addBranchGroupForm: FormGroup = this.fb.group({
    setAsNecessary: [''],
    type: ['first'],
    typeOfJustificationFirst: ['', Validators.required],
    typeOfJustification: ['', Validators.required],
    historyOfJustification: ['', Validators.required],
    timeAttendance: [''],
    workTeam: [""],
    notes: ['']
  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  toggleHistoryOfJustification = false;
  constructor(
    public dialogRef: MatDialogRef<DialogRequestTaskWithDropdownComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

    this.addBranchGroupForm.get("typeOfJustification")?.valueChanges.subscribe(data => {
      if (data.key === "4") {
        this.addBranchGroupForm.get("timeAttendance")?.setValue("")
        this.toggleHistoryOfJustification = true;
      } else {

        this.addBranchGroupForm.get("timeAttendance")?.setValue("")
        this.toggleHistoryOfJustification = false;

      }

      // (this.commissionFormGroup.get("flat") as FormGroup).addControl("flatAmountDebit", this.fb.control(null, [Validators.required, this.amountCreditedValidator("minDebit", "maxDebit")]));

    })
  }
  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }
  onRemoveCommercialReg(event: any) {

    let indexFile = this.uploadedCommercialRegFiles.findIndex(item => item.fileUpload.lastModified === event.lastModified);
    this.uploadedCommercialRegFiles.splice(indexFile, 1)
    this.uploadedCommercialRegFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;
    // this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
  }
  onUploadCommercialReg(event: UploadEvent) {

    for (let file of event.files) {
      var reader = new FileReader();

      let thisParent = this;
      reader.readAsDataURL(file);
      reader.onload = (function (file) {
        return function (e: any) {

          // Render thumbnail.
          thisParent.uploadedCommercialRegFiles.push({ imageSrc: e.target.result, fileUpload: file });

        };

      })(file);



      // this.uploadedCommercialRegFiles.push({ imageSrc: src, fileUpload: file });


    }
    // this.uploadedCommercialRegFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;

    // this.messageService.add({ severity: 'info', summary: 'File Uploaded', detail: '' });
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
