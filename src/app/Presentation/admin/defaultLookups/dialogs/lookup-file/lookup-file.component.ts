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
import * as moment from 'moment';
import { DefaultLookupsService } from '../../services/default-lookups.service';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  message: string,
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
  selector: 'app-lookup-file',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './lookup-file.component.html',
  styleUrls: ['./lookup-file.component.scss']
})
export class LookupFileComponent {
  loading = true;
  private defaultLookupsService = inject(DefaultLookupsService);

  @Input() submitted!: boolean;
  info!: any;
  @Input() id!: any;
  AttachmentsFiles: any[] = [];
  @Input() infoType!: number;


  constructor(
    public dialogRef: MatDialogRef<LookupFileComponent>,
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

    if (this.id) {
      let defaultLookupsService:any;
      switch (this.infoType) {
        case 0:
          defaultLookupsService = this.defaultLookupsService.vacationTypeInfo({ vacationTypeId: this.id })
          break;
          case 1:
            defaultLookupsService = this.defaultLookupsService.jobTitlesInfo({ JobTitleId: this.id })
            break;
            case 2:
              defaultLookupsService = this.defaultLookupsService.departmentsInfo({ DepartmentId: this.id })
              break;
              case 3:
                defaultLookupsService = this.defaultLookupsService.officialHolidayInfo({ OfficialHolidayId: this.id })
                break;
                case 4:
                  defaultLookupsService = this.defaultLookupsService.taskTypeInfo({ TaskTypeId: this.id })
                  break;
                  case 5:
                  defaultLookupsService = this.defaultLookupsService.permissionTypeInfo({ PermissionTypeId: this.id })
                  break;
                  case 6:
                    defaultLookupsService = this.defaultLookupsService.justificationTypeInfo({ JustificationTypeId: this.id })
                    break;
                    case 6:
                      defaultLookupsService = this.defaultLookupsService.justificationTypeInfo({ JustificationTypeId: this.id })
                      break;
                      case 7:
                        defaultLookupsService = this.defaultLookupsService.shiftTypeInfo({ shiftTypeId: this.id })
                        break;
                        case 8:
                        defaultLookupsService = this.defaultLookupsService.penaltiesInfo({ PenaltiesId: this.id })
                        break;
                      
        default:
          break;
      }
      defaultLookupsService.subscribe(
        {

          next: data => {
            this.loading = false;

            this.info = data;


          },
          error: err => {
            this.loading = false;

          }
        })

    }
  }
  getMoment(date: any) {
    return moment(new Date(date)).format("MM/DD/YYYY")
  }


  close(): void {
    this.dialogRef.close(false);
  }
}
