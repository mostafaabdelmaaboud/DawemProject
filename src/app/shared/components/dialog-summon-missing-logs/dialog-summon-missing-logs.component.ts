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

import { SchedualPlanService } from 'src/app/Presentation/user/schedual-plan/services/schedual-plan.service';
import { SummonsService } from 'src/app/Presentation/user/summons/services/summons.service';
import { SummonMissingLogsService } from 'src/app/Presentation/user/summon-missing-logs/services/summon-missing-logs.service';
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
  selector: 'app-dialog-summon-missing-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRadioModule, MatProgressSpinnerModule, ReactiveFormsModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './dialog-summon-missing-logs.component.html',
  styleUrls: ['./dialog-summon-missing-logs.component.scss']
})
export class DialogSummonMissingLogsComponent {
  loading = false;
  private summonMissingLogsService = inject(SummonMissingLogsService);

  @Input() submitted!: boolean;
  info!: any;
  @Input() id!: any;


  constructor(
    public dialogRef: MatDialogRef<DialogSummonMissingLogsComponent>,
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

      this.summonMissingLogsService.summonGetInfo({ summonMissingLogId: this.id }).subscribe(data => {
        this.info = data;
        this.info.summonDate = moment(new Date(this.info.dateAndTime)).format("MMMM Do YYYY, h:mm:ss a")

        this.loading = false;

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
