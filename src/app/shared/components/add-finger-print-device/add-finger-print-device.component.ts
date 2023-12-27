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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatRadioModule } from '@angular/material/radio';
import { FingerPrintDevicesService } from 'src/app/Presentation/user/finger-print-devices/services/finger-print-devices.service';
interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  titleClose: string;
  setAsActive: string;


  titleName: string;
  placeholdeName: string;
  ValidationName: string;

  titleFieldDisabled: string;
  placeholdeieldDisabled: string;

  titleIpAddress: string;
  placeholdeIpAddress: string;
  ValidationIpAddress: string;

  titlePortNumber: string;
  placeholdePortNumber: string;
  ValidationPortNumber: string;

  titleModel: string;
  placeholderModel: string;
  validationModel: string;

  titleSerialNumber: string;
  placeholdeSerialNumber: string;
  ValidationSerialNumber: string;


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
  selector: 'app-add-finger-print-device',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatRadioModule, MultiSelectModule, MatProgressSpinnerModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-finger-print-device.component.html',
  styleUrls: ['./add-finger-print-device.component.scss']
})
export class AddFingerPrintDeviceComponent {
  loading = false;


  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  list: any[] = [
  ];
  @Input() editFingerPrintDevice!: boolean;
  @Input() id!: string;


  private fingerPrintDevicesService = inject(FingerPrintDevicesService);


  employeeIdToggle = true;
  groupIdToggle = false;
  departmentIdToggle = false;

  weekDays: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    isActive: [false],
    name: ["", Validators.required],
    fieldDisabled: [""],
    IpAddress: ['', Validators.required],
    PortNumber: ["", Validators.required],
    Model: ['', Validators.required],
    SerialNumber: ['', Validators.required],
  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<AddFingerPrintDeviceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = true;
    if (this.editFingerPrintDevice) {
      this.fingerPrintDevicesService.fingerprintDeviceGetById({ fingerprintDeviceid: this.id }).subscribe(
        {
          next: data => {
            this.getControl("isActive")?.setValue(data.isActive);

            this.getControl("fieldDisabled")?.setValue(data.code);
            this.getControl("name")?.setValue(data.name);
            this.getControl("IpAddress")?.setValue(data.ipAddress);
            this.getControl("PortNumber")?.setValue(data.portNumber);
            this.getControl("Model")?.setValue(data.model);
            this.getControl("SerialNumber")?.setValue(data.serialNumber);
            this.loading = false;
          },
          error: err => {
            this.loading = false;
          }
        }
      )

    }
    if (!this.editFingerPrintDevice) {
      this.loading = false;

    }

  }
  nodeSelect(data: any) {
  }


  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }

  request() {

    if (this.addBranchGroupForm.valid && this.submitted) {
      this.submitted = false;
      this.submitClicked.emit(this.addBranchGroupForm.value);
      // this.dialogRef.close(true);
    } else {
      this.getControl("ScheduleId")?.markAsDirty();
      this.getControl("SchedulePlanType")?.markAsDirty();
      this.getControl("DateFrom")?.markAsDirty();
      this.getControl("notes")?.markAsDirty();
      this.getControl("EmployeeId")?.markAsDirty();
      this.getControl("DepartmentId")?.markAsDirty();
      this.getControl("GroupId")?.markAsDirty();



    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
