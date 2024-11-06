import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ToastrService } from 'ngx-toastr';
interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  addBranchesInputsProps: addBranchesInputsProps[],
  setAsNecessary: string;
  titleDropdownSecond: string;
  labelRadioButtonFirst: string;
  firstRadio: string;
  secondRadio: string;
  thirdRadio: string;
  firstRadiTwo: string;
  secondRadioTwo: string;
  thirdRadioTwo: string;
  titleClose: string;
  titleFieldDisabled: string;
  placeholdeieldDisabled: string;
  placeholderDropdown: string;
  fieldFirst: string;
  placeholdefieldFirst: string;
  validationtitlefieldFirst: string;
  labelEmployeeName: string;
  firstRadioEmployeeName: string;
  secondRadioEmployeeName: string;
  thirdRadioEmployeeName: string;
  thirdRadioFour: string;

  placeholderCalendar: string;
  titleNotes: string;
  placeholdeNotes: string;
  titleDropdownFirst: string;
  placeholderDropdownFirst: string;
  validationtitleDropdownFirst: string;
  titleCalendar: string;
  validationCalendar: string;
  labelRadioButtonSecond: string;
  validationtitleDropdownSecond: string;
  validationtitleNotes: string;
  titleWorkSchedule: string
  placeholderWorkSchedule: string;
  validationtitleWorkSchedule: string;
  directManager: string;
  placeholdeDirectManager: string;
  validationtitleDirectManager: string;
  address: string;
  placeholdeAddress: string;
  validationtitleAddress: string;
  email: string;

  placeholdeEmail: string;

  validationtitleEmail: string;
  mobileNumber: string;

  placeholdeMobileNumber: string;
  validationtitleEmailPattern: string;
  validationtitleMobileNumber: string;
  JobNumber: string;
  placeholdeJobNumber: string;
  validationtitleJobNumber: string;
  uploadFile: string;
  chooseLabel: string;
  message: string,
  title: string;
  type: string,
  buttonSend: string,
  code: string;
  buttonClose: string,
  refrenceId?: string,
  subTitle?: string
}

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-dialog-upload-file',
  standalone: true,
  imports: [CommonModule, FormsModule, MatProgressSpinnerModule, ReactiveFormsModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './dialog-upload-file.component.html',
  styleUrls: ['./dialog-upload-file.component.scss']
})
export class DialogUploadFileComponent {
  loading = false;
  @Input() departmentIsReadOnly = false;
  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  viewImagesIdCopy: any[] = [];
  imageArray: any[] = [];
  errorUploadFileIdCopyIsRequired!: string;
  errorUploadFileIdCopy!: string;
  errorFile: any[] = [];
  public viewImage: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
 
    idCopyFile: ['', Validators.required]
  });
  AttachmentsFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<DialogUploadFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    private authService: AuthService,
    private toastr: ToastrService,
    public translate: TranslateService,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  } 

  onRemoveCommercialReg(event: any) {
    
    let indexFile = this.AttachmentsFiles.findIndex(item => item.fileUpload.lastModified === event.lastModified);
    this.AttachmentsFiles.splice(indexFile, 1)
    this.AttachmentsFiles.length === 0 ? this.requiredCommercialRegFiles = true : this.requiredCommercialRegFiles = false;
    if(this.requiredCommercialRegFiles) {
      this.addBranchGroupForm.get("idCopyFile")?.setValue("");
      this.errorUploadFileIdCopy = "";


    }
  }
  async onFileChange(pFileList: any, stepIndex: number) {
    
    if (pFileList.files?.length <= 5 || pFileList.length <= 5) {
      this.errorUploadFileIdCopyIsRequired = "";
      let indexidCopyFiles = [...this.AttachmentsFiles];
      if (indexidCopyFiles.length <= 5) {
        let idCopyFiles = [...this.AttachmentsFiles, ...Object.keys(pFileList.files).map(key => pFileList.files[key])];
        let findIndexFileName:any[] = [];
        for (let index = 0; index < pFileList.files.length; index++) {
          const fileSize = pFileList.files[index];
          findIndexFileName = idCopyFiles.filter(file => file.name == pFileList.files[index].name);
          if(findIndexFileName.length < 2) {
            if(fileSize?.size < (20 * 1024 * 1024)) {
              this.viewImage=[pFileList.files[index]];
              this.AttachmentsFiles=[{fileUpload:pFileList.files[index], detailsImage: false}];
              this.errorUploadFileIdCopy = "";
            } else {
              this.errorUploadFileIdCopy = "The file size must be less than 20MB";
            }
          } else {
            if(fileSize?.size > (20 * 1024 * 1024)) {
              this.errorUploadFileIdCopy = "The file size must be less than 20MB";
            } else {
              this.errorUploadFileIdCopy = "The file is duplicate";
            }
          }
        }
        if(this.errorUploadFileIdCopy === "" && findIndexFileName.length < 2 && this.viewImage.length > 0) {
          for (let index = 0; index < this.viewImage.length; index++) {
            let filereaderTwo = new FileReader();
            const fileSize = this.viewImage[index];
            if (fileSize?.size > (20 * 1024 * 1024)) {
              this.errorUploadFileIdCopy = "The file size must be less than 20MB";
              return;
            } else {
              this.imageArray = [];
              this.errorUploadFileIdCopy = "";
              var validExts = new Array(".xlsx", ".xls");
              let fileExt = this.viewImage[index]?.name.substring(this.viewImage[index]?.name.lastIndexOf('.'));
              await filereaderTwo.readAsDataURL(this.viewImage[index]);
              filereaderTwo.onload = () => {
                if((filereaderTwo.result as string).includes("application/pdf")) {
                  this.imageArray =["assets/img/pdf.png"];
                } else if(validExts.indexOf(fileExt) >= 0) {
                  this.imageArray=["assets/img/excel.png"];
                } else {
                  this.imageArray= [filereaderTwo.result];
                }
                this.viewImagesIdCopy = this.imageArray;
              }
              this.addBranchGroupForm.get("idCopyFile")?.setValue(this.viewImage[0]?.name);
              this.errorUploadFileIdCopyIsRequired = "";
            }
          }
          if(findIndexFileName.length > 1) {
            this.errorUploadFileIdCopy = "The file is duplicate";
          }
        }
      } else {
        this.errorUploadFileIdCopyIsRequired = "You can only select up to 5 files.";
      }
    } else {
      this.errorUploadFileIdCopyIsRequired = "You can only select up to 5 files.";
    }
  }
  getControl(controlName: string) {
    return this.addBranchGroupForm?.get(controlName);
  }

  request() {
    
    if (this.addBranchGroupForm.valid && this.submitted) {
      this.submitted = false;
      this.submitClicked.emit({files: this.AttachmentsFiles });
      // this.dialogRef.close(true);
    } else {
      this.getControl("idCopyFile")?.markAsDirty();

    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
