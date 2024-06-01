import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SchedulesService } from 'src/app/Presentation/user/tables/services/schedules.service';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';

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

  TitleFriday: string,
  PlaceholderFriday: string,
  ValidationFriday: string,

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
  selector: 'app-add-table',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatProgressSpinnerModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-table.component.html',
  styleUrls: ['./add-table.component.scss']
})
export class AddTableComponent {
  loading = false;
  private schedulesService = inject(SchedulesService);

  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  list: any[] = [
  ];
  @Input() editSchedule!: boolean;
  @Input() id!: string;


  weekDays: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    tableName: ['', Validators.required],
    weekDays: this.fb.array([])

  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<AddTableComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataDialog | null,
    public translate: TranslateService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.loading = true;
    let GetWeekDays = this.schedulesService.GetWeekDays();
    let GetWeekDaysDropdown = this.schedulesService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });



    combineLatest({
      GetWeekDays,
      GetWeekDaysDropdown
    }).subscribe(
      {
        next: data => {

          data.GetWeekDays?.data?.forEach((day: any, i: number) => {

            (this.addBranchGroupForm.get("weekDays") as FormArray).push(this.getFormArrayWeekDays(day.name, day.weekDay))
            this.weekDays.push({ name: day.name, weekDay: day.id });


            this.list[i] = {
              weekDay: day.weekDay,
              data: []
            }
            data.GetWeekDaysDropdown?.data?.forEach((day: any) => {


              this.list[i].data.push({ name: day.name, key: day.id })
            });


          });


          this.loading = false;

          if (this.editSchedule) {
            this.schedulesService.scheduleGetById({ scheduleId: this.id }).subscribe(
              {
                next: data => {

                  this.addBranchGroupForm.get("tableName")?.setValue(data.name);
                
                  data?.scheduleDays?.forEach((day: any) => {
               
                  

                    (this.addBranchGroupForm.get("weekDays") as FormArray).controls.forEach((control: any, i: number) => {

                      if (control.value.weekDay === day.weekDay) {

                        let getIndexList = this.list.findIndex(dayList => dayList?.weekDay === control.value.weekDay);
                        if (getIndexList >= 0) {
                          if(day.shiftId != null) {
                            this.schedulesService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id:day.shiftId }).subscribe({
                              next:data => {
                                this.list[getIndexList].data = [];
                                data.data.forEach(weekDay=>{
                                  this.list[i].data.push({ name: weekDay.name, key: weekDay.id })
  
                                });
                                let getshifts = this.list[getIndexList]?.data.findIndex((shift: any) => shift?.key === day.shiftId);
                            
                                if(getshifts >=0) {
                                  this.getFormArray().at(i).get("weekDayValue")?.setValue(this.list[getIndexList]?.data[getshifts]);
      
                                }
                              },
                              error:err => {
        
                              }
                            });
  
                          }
                        
                     
                

                          (this.getFormArray().at(i) as FormGroup).addControl("id", new FormControl(day.id));
                        }

                      }
                    });
                  });
                  this.loading = false;
                },
                error: err => {
                  this.loading = false;
                }
              }
            )

          }
          if (!this.editSchedule) {
            this.loading = false;

          }

        },
        error: err => {
          this.loading = false;

        }
      }
    )
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string, weekDay: any) {

    switch (type) {
      case 'weekDayValue':
        if (data || data === "") {
          if (data !== this.lastSearchQuery) {
            this.lastSearchQuery = data;
            this.schedulesService.GetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                let getIndexList = this.list.findIndex(dayList => dayList?.weekDay === weekDay);
                if (getIndexList >= 0) {
                  this.list[getIndexList].data = res.data;
                }

              });
          }

        }
        break;


      default:
        break;
    }
  }
  getFormArray(): FormArray {
    return this.addBranchGroupForm.get("weekDays") as FormArray
  }
  getFormArrayWeekDays(name: string, weekDay: number): FormGroup {
    return this.fb.group({
      name: [name],
      weekDay: [weekDay],
      weekDayValue: [""]
    })
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

      this.getControl("tableName")?.markAsDirty();
      new Array(this.addBranchGroupForm.get("weekDays")).forEach((formControl: any) => {
        formControl.controls.forEach((nestedFormControl: any) => {

          nestedFormControl.get('weekDayValue')?.markAsDirty();

        });
      });


    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
