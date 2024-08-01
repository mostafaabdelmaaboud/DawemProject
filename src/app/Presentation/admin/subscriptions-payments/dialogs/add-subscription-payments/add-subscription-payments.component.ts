import { Component, EventEmitter, Inject, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth/services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { CalendarModule } from "primeng/calendar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { combineLatest, debounceTime, distinctUntilChanged } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';

import { MatRadioModule } from '@angular/material/radio';

import { SubscriptionsPaymentsService } from '../../services/subscriptions-payments.service';

interface addBranchesInputsProps {
  LabelMessage: string;
  inputType: string;
  name: string;
  message: string;
}

interface DataDialog {
  titleClose: string;
  setAsActive: string;
  titleNotes: string,
  placeholdeNotes: string,
  ValidationNotes: string,
  Titlesaturday: string,

  labelRadioButton: string;
  firstRadio: string;
  secondRadio: string;
  thirdRadio: string;

  titleDepartmentId: string;
  placeholdeDepartmentId: string;
  ValidationDepartmentId: string;

  titleFieldDisabled: string;
  placeholdeieldDisabled: string;

  titleEmployeeId: string;
  placeholdeEmployeeId: string;
  ValidationEmployeeId: string;

  titleGroupId: string;
  placeholdeGroupId: string;
  ValidationGroupId: string;

  titleVacationType: string;
  placeholdeVacationType: string;
  ValidationVacationType: string;

  titleCalendar: string;
  placeholderCalendar: string;
  validationCalendar: string;

  titleBalance: string;
  placeholderBalance: string;
  validationBalance: string;


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
  selector: 'app-add-subscription-payments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatRadioModule, MultiSelectModule, MatProgressSpinnerModule, DropdownModule, CalendarModule, InputSwitchModule, InputTextModule, TranslateModule, FileUploadModule],
  templateUrl: './add-subscription-payments.component.html',
  styleUrls: ['./add-subscription-payments.component.scss']
})
export class AddSubscriptionPaymentsComponent {
  loading = false;


  @Output() submitClicked = new EventEmitter<any>();
  @Input() submitted!: boolean;
  list: any[] = [
  ];
  @Input() editSubscription!: boolean;
  @Input() id!: string;


  listSubscriptions: any[] = [];

  private subscriptionsPaymentsService = inject(SubscriptionsPaymentsService);


  employeeIdToggle = true;
  groupIdToggle = false;
  departmentIdToggle = false;

  weekDays: any[] = [];
  addBranchGroupForm: FormGroup = this.fb.group({
    isActive: [false],
    SubscriptionId: ["", Validators.required],
    Amount: ['', Validators.required],
    Date: ['', Validators.required],
    notes: [""],

  });
  uploadedCommercialRegFiles: any[] = [];
  requiredCommercialRegFiles = false;
  constructor(
    public dialogRef: MatDialogRef<AddSubscriptionPaymentsComponent>,
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



    let subscription = this.subscriptionsPaymentsService.subscriptionGetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0 });




    combineLatest({
      subscription
    }).subscribe(
      {
        next: data => {

         

          this.listSubscriptions = [];

     
          data.subscription?.data?.forEach((day: any) => {
            this.listSubscriptions.push({ name: day.name, key: day.id });

          });
 

          if (this.editSubscription) {
            this.subscriptionsPaymentsService.SubscriptionGetById({ subscriptionPaymentId: this.id }).subscribe(
              {
                next: data => {

                  this.getControl("isActive")?.setValue(data.isActive);
                  this.getControl("notes")?.setValue(data.notes);
                  this.getControl("Amount")?.setValue(data.amount);
                  this.getControl("Date")?.setValue(new Date(data.date));

                    this.subscriptionsPaymentsService.subscriptionGetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, id: data.subscriptionId }).subscribe(dataDropdown => {
                      this.listSubscriptions = [];
                      dataDropdown.data?.forEach((list: any) => {
                        this.listSubscriptions.push({ name: list.name, key: list.id });
                      });
                      let indexsubscriptionId = this.listSubscriptions.findIndex(list => list.key === data.subscriptionId);
                      if (indexsubscriptionId >= 0) {
                        this.getControl("SubscriptionId")?.setValue(this.listSubscriptions[indexsubscriptionId]);

                      }

                    });

                  this.loading = false;
                },
                error: err => {
                  this.loading = false;
                }
              }
            )

          }
          if (!this.editSubscription) {
            this.loading = false;

          }

        },
        error: err => {
          this.loading = false;

        }
      }
    )
   
  }
  nodeSelect(data: any) {
  }
  lastSearchQuery = "";

  searchDropdown(data: any, type: string) {

    switch (type) {
      case 'SubscriptionId':
        if (data || data === "") {
          if (data !== this.lastSearchQuery || data === "") {
            this.lastSearchQuery = data;
            this.subscriptionsPaymentsService.subscriptionGetForDropDown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
              debounceTime(300),
              distinctUntilChanged()).subscribe((res: any) => {
                this.listSubscriptions = [];
                this.lastSearchQuery = "";
                res.data?.forEach((day: any) => {
                  this.listSubscriptions.push({ name: day.name, key: day.id });
                });
              });
          }
        }
        break;
      // case 'DepartmentId':
      //   if (data || data === "") {
      //     if (data !== this.lastSearchQuery || data === "") {
      //       this.lastSearchQuery = data;
      //       this.vacationBalanceService.departmentForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
      //         debounceTime(300),
      //         distinctUntilChanged()).subscribe((res: any) => {
      //           this.listDepartmentId = [];
      //           this.lastSearchQuery = "";
      //           res.data?.forEach((day: any) => {
      //             this.listDepartmentId.push({ name: day.name, key: day.id });
      //           });
      //         });
      //     }

      //   }
      //   break;
      // case 'VacationType':
      //   if (data || data === "") {
      //     if (data !== this.lastSearchQuery || data === "") {
      //       this.lastSearchQuery = data;
      //       this.vacationBalanceService.vacationForDropdown({ PagingEnabled: true, PageSize: 5, PageNumber: 0, FreeText: data }).pipe(
      //         debounceTime(300),
      //         distinctUntilChanged()).subscribe((res: any) => {
      //           this.listCompanies = [];
      //           this.lastSearchQuery = "";
      //           res.data?.forEach((day: any) => {
      //             this.listCompanies.push({ name: day.name, key: day.id });
      //           });
      //         });
      //     }

      //   }
      //   break;

      default:
        break;
    }
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
      this.getControl("SubscriptionId")?.markAsDirty();
      this.getControl("Amount")?.markAsDirty();
      this.getControl("Date")?.markAsDirty();
      this.getControl("notes")?.markAsDirty();
    }

  }
  close(): void {
    this.dialogRef.close(false);
  }
}
