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

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  titleClose: string;

  titleTableName: string,
  placeholdetableName: string,
  ValidationTableName: string,
  Titlesaturday: string,

  Placeholdersaturday: string,
  validationSaturday: string,
  TitleSunday: string,
  PlaceholderSunday: string,
  ValidationSunday: string,
  TitleMonday: string,
  PlaceholderMonday: string,
  validationMonday: string,
  TitleTuesday: string,
  PlaceholderTuesday: string,
  ValidationTuesday: string,
  TitleWednesday: string,
  PlaceholderWednesday: string,
  ValidationWednesday: string,
  TitleThursday: string,
  PlaceholderThursday: string,
  ValidationThursday: string,
  titleFieldDisabled: string,
  placeholdeieldDisabled: string,
  TitleFriday: string,
  PlaceholderFriday: string,
  ValidationFriday: string,
  code: string;
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
  selector: 'app-edit-group',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent {

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  @Input() list: any[] = [
    { name: "تكليف بادارة الفريق", key: "1" },
    { name: "تكليف بادارة فريق اخر", key: "2" },
    { name: "تكليف بالانتداب للعمل ", key: "3" },
    { name: "تكليف بالانتقال لفريق اخر", key: "4" }

  ];
  listTwo: any[] = [
    { name: "احمد علي", key: "1" },
    { name: "سيد علي", key: "2" },
    { name: "محسن علي", key: "3" },
    { name: "رجب", key: "4" }

  ];
  addBranchGroupForm: FormGroup = this.fb.group({
    tableName: [''],
    saturday: ['', Validators.required],
    fieldDisabled: ['', Validators.required],
    sunday: ['', Validators.required],
    monday: ['', Validators.required],
    tuesday: ['', Validators.required],
    wednesday: ['', Validators.required],
    thursday: ['', Validators.required],
    friday: ['', Validators.required]
  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<EditGroupComponent>,
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
