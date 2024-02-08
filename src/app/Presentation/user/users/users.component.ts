import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PaginationInstance } from 'ngx-pagination';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastSuccessComponent } from 'src/app/shared/components/toast-success/toast-success.component';
import { MediaMatcher } from '@angular/cdk/layout';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from './services/users.service';
import { AddUserComponent } from 'src/app/shared/components/add-user/add-user.component';
import { DialogDeleteComponent } from 'src/app/shared/components/dialog-delete/dialog-delete.component';
import { DialogUserFileComponent } from 'src/app/shared/components/dialog-user-file/dialog-user-file.component';
import { PermissionsUserService } from 'src/app/shared/services/permissions-user.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  date!: Date;
  arabic: any;
  subscription!: Subscription;
  itemsPerPage = 5;
  filterForm!: FormGroup;
  private dialog = inject(MatDialog);
  list: any[] = [
    { name: "نسيان تسجيل حضور", key: "1" },
    { name: "نسيان تسجيل انصراف", key: "2" },
    { name: "تسجيل حضور خاطئ", key: "3" },
    { name: "تسجيل انصراف خاطئ", key: "4" }

  ];
  columns: any[] = [
    {
      name: "رقم المستخدم",
      field: "code",
    },
    {
      name: "اسم المستخدم",
      field: "name",
    },

    {
      name: "مدير",
      field: "isAdmin"
    },
    {
      name: "نشط",
      field: "isActive"
    },
    {
      name: "الإجراء",
      field: "actions"
    }

  ];

  users: any = [];

  isLoading = true;

  filteration: any = {
    PageSize: 5,
    PageNumber: 0,
    PagingEnabled: true
  };

  services: any[] = [
    { name: 'Cash in', key: 'cashIn' },
    { name: 'Cash out', key: 'cashOut' }
  ];
  page = 0;
  categories: any[] = [
  ];
  public configs: PaginationInstance = {
    id: "custom",
    itemsPerPage: 10,
    currentPage: 1,
  };
  private usersService = inject(UsersService)

  totalItems: number = 0;
  first: number = 0;
  rows: number = 10;
  RowsPerPage!: any[];
  mobileQuery: MediaQueryList;
  opened = false;
  cards!: any;
  spinnerCards = false;
  private _mobileQueryListener: () => void;
  constructor(private config: PrimeNGConfig, private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
    public translate: TranslateService, private fb: FormBuilder, private toast: ToastrService,
    private permissionsUserService: PermissionsUserService) {
    this.date = new Date();
    this.mobileQuery = media.matchMedia('(max-width: 520px)');

    this._mobileQueryListener = () => {
      if (this.mobileQuery.matches) {
        this.opened = true;
        this.users = this.users;
        changeDetectorRef.detectChanges();
      } else {
        this.opened = false;
        this.users = this.users;

        changeDetectorRef.detectChanges();

      }



    };
    this.mobileQuery.addListener(this._mobileQueryListener);
    translate.addLangs(['ar', 'en']);
    translate.setDefaultLang('ar');
    const browserLang: any = translate.getBrowserLang();
    let lang = browserLang.match(/ar|en/) ? browserLang : 'ar';

    this.subscription = this.translate.stream('primeng').subscribe(data => {
      this.config.setTranslation(data);
    });
  }
  ngOnInit(): void {
    if (this.mobileQuery.matches) {
      this.opened = true;
    } else {
      this.opened = false;

    }
    this.filterForm = this.fb.group({
      FreeText: [""],

    });
    this.categories.push({ name: "adasd", key: "adsas" });
    this.RowsPerPage = [
      { name: '5', code: 5 },
      { name: '10', code: 10 },
      { name: '25', code: 25 },

    ];

    this.getInformation();

    this.getUsers(this.filteration);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }
  getInformation() {
    this.spinnerCards = true;
    this.usersService.getInformation().subscribe({
      next: data => {

        this.cards = {
          ...data
        };
        this.spinnerCards = false;

      },
      error: err => {
        this.spinnerCards = false;

      }
    })
  }
  filter() {
    let filteration = { ...this.filteration }
    Object.entries(this.filterForm?.value).forEach(([key, value]: any) => {
      if (typeof value  === 'string') {
        if(value != "") {
          filteration[key] = value.trim();
        }
      } else {
        if(value >=0) {
          filteration[key] = value;

        }

      }
    })
    this.getUsers(filteration);
  }
  exportTableToExcel() {
   
    let columns = [...this.columns];
    delete columns[4]
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: true,
      title: 'المستخدمين',
      useBom: true,
      headers: columns.map((column:any) => column.name)
    };
    debugger;
    let formatTable = this.users.map(user => {
      
      return {
        code: user.code,
        name: user.name.name,
        isAdmin: user.isAdmin ? 'نعم' : 'لا',
        isActive: user.isActive ? 'نعم' : 'لا'
      }
    })
    new ngxCsv(formatTable, "sheet", options);
  }
  exportTableToPDF() {
    let table: any = document.getElementById("tableUsersHidden");
    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 100); 
      pdf.save('ملف_PDF.pdf');
    });
  

  }
  resetFilteration() {
    this.filterForm.get("FreeText")?.setValue("");

    this.filteration = {
      PageSize: 5,
      PageNumber: 0,
      PagingEnabled: true
    };
    this.getUsers(this.filteration);
  }
  getUsers(filteration: any) {
    this.users = [];
    this.isLoading = true;
    this.usersService.listUsers(filteration).subscribe(data => {

      data?.data?.forEach((user: any) => {
        this.users.push({
          id: user.id,
          code: user.code,
          name: {
            name: user.name,
            alt: user.name,
            img: user.profileImagePath ? user.profileImagePath : "../../../../assets/img/5034901-200.png"
          },
          isAdmin: user.isAdmin,
          isActive: user.isActive
        })
      });
      this.totalItems = data.totalCount
      this.isLoading = false;


    })
  }
  mathRound(data: any) {
    return Math.ceil(data)
  }
  numberOfRowsPerPage(data: any) {
    this.filteration = { ...this.filteration, PageSize: data.value.code };
    this.getUsers(this.filteration);
  }
  sendRequest(data: any) {

    this.usersService.accept({ requestId: data.id }).subscribe(
      {
        next: res => {
          this.getUsers(this.filteration);
          const succressDialog = this.dialog.open(ToastSuccessComponent, {
            width: "30vw",
            data: {
              title: "تم قبول الطلب",
              message: res.message,
              buttonSend: "اغلاق"
            },
          });
          setTimeout(() => {
            succressDialog.close();

          }, 2000);
          succressDialog.componentInstance.submitted = true;
          succressDialog.componentInstance.submitClicked.subscribe(result => {
            succressDialog.close();

          })
        },
        error: err => {

        }
      }
    )

  }
  reasonOfRefuse(data: any) {
    const reasonOfRefuseDialog = this.dialog.open(DialogDeleteComponent, {
      width: "30vw",
      data: {
        title: "هل متأكد من حذف المستخدم؟",
        message: "برجاء توضيح السبب إن أمكن",

        titleClose: "تراجع",
        buttonSend: "حذف"
      },
    });

    reasonOfRefuseDialog.componentInstance.submitted = true;
    reasonOfRefuseDialog.componentInstance.submitClicked.subscribe(result => {
      reasonOfRefuseDialog.componentInstance.submitted = false;
      this.usersService.deleteUser({ userId: data.id }).subscribe({
        next: res => {
          this.toast.success(res.message);
          reasonOfRefuseDialog.componentInstance.submitted = true;
          reasonOfRefuseDialog.close();
          this.getUsers(this.filteration);
        },
        error: err => {
          reasonOfRefuseDialog.componentInstance.submitted = true;

        }
      })



    })
  }
  requestUser() {
    const dialogRefAddCurrency = this.dialog.open(AddUserComponent, {
      width: "50vw",
      data: {
        title: "انشاء مستخدم",
        setAsNecessary: "تعيين كنشط",

        titleName: "الاسم <span class='color-red'>*</span>",
        placeholdeName: "الاسم",
        nameValidation: "الاسم مطلوب",

        titleEmail: "البريد الالكتروني <span class='color-red'>*</span>",
        placeholdeEmail: "البريد الالكتروني",
        EmailValidation: "البريد الالكتروني مطلوب",

        titlePassword: "كلمة السر <span class='color-red'>*</span>",
        placeholdePassword: "كلمة السر",
        PasswordValidation: "كلمة السر مطلوبة",
        Roles: " الصلاحيات <span class='color-red'>*</span>",
        placeholdeRoles: "الصلاحيات",
        ValidationRoles: "الصلاحيات مطلوبة",

        titleCalendar: "تاريخ الاجازة <span class='color-red'>*</span>",
        placeholderCalendar: "تاريخ الاجازة",

        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "الملاحظات",
        NotesValidation: "الملاحظات مطلوب",

        dateTaskValidation: "تاريخ الاجازة مطلوب",
        labelRadioButton: "صاحب الطلب",
        firstRadio: "لنفسي",
        secondRadio: "لموظف",
        titleEmployeeId: "الموظف <span class='color-red'>*</span>",
        placeholderEmployeeId: "الموظف",
        EmployeeIdValidation: "الموظف مطلوب",
        uploadFile: "ارفاق صورة",
        chooseLabel: "اختار صورة ليتم رفعه",
        buttonSend: "إرسال الطلب"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editUser = false;


    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {

      let formData = new FormData();
      formData.append("CreateUserModelString", JSON.stringify({
        IsActive: result.IsActive,
        Name: result.Name,
        EmployeeId: result.EmployeeId.key,
        Email: result.Email,
        MobileNumber: result.MobileNumber,
        Password: result.Password,
        ConfirmPassword: result.ConfirmPassword,
        Roles: result.Roles.map((role: any) => role.key),
        IsAdmin: Array.isArray(result.IsAdmin) ? result.IsAdmin[0] : result.IsAdmin
      }));
      // if (result?.zoneIds?.length > 0) {
      //   result?.zoneIds?.forEach((direct: any) => {
      //     formData.zoneIds.push(direct.key);
      //   });
      // }
      result.files.forEach((file: any) => {
        if (file.detailsImage === false) {
          formData.append("ProfileImageFile", file.fileUpload, file.fileUpload.name);
        }
      });
      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;

      this.usersService.createUser(formData).subscribe(
        {
          next: (data: any) => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات المستخدمين"

              },
            });
            this.getUsers(this.filteration);

            setTimeout(() => {
              succressDialog.close();

            }, 2000);
            succressDialog.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

            succressDialog.componentInstance.submitClicked.subscribe(result => {
              succressDialog.close();
            })

          },
          error: (err: any) => {
            dialogRefAddCurrency.componentInstance.loading = false;

            dialogRefAddCurrency.componentInstance.submitted = true;

          }
        }
      )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  showActions(data: any) {
    return this.permissionsUserService.checkPermission({ type: "actions", screenCode: 34, actionCode: data.actionCode })
  }
  editUser(data: any) {
    const dialogRefAddCurrency = this.dialog.open(AddUserComponent, {
      width: "50vw",
      data: {
        title: "انشاء مستخدم",
        setAsNecessary: "تعيين كنشط",

        titleName: "الاسم <span class='color-red'>*</span>",
        placeholdeName: "الاسم",
        nameValidation: "الاسم مطلوب",

        titleEmail: "البريد الالكتروني <span class='color-red'>*</span>",
        placeholdeEmail: "البريد الالكتروني",
        EmailValidation: "البريد الالكتروني مطلوب",

        titlePassword: "كلمة السر <span class='color-red'>*</span>",
        placeholdePassword: "كلمة السر",
        PasswordValidation: "كلمة السر مطلوبة",
        Roles: " الصلاحيات <span class='color-red'>*</span>",
        placeholdeRoles: "الصلاحيات",
        ValidationRoles: "الصلاحيات مطلوبة",

        titleCalendar: "تاريخ الاجازة <span class='color-red'>*</span>",
        placeholderCalendar: "تاريخ الاجازة",

        titleNotes: "الملاحظات <span class='color-red'>*</span>",
        placeholdeNotes: "الملاحظات",
        NotesValidation: "الملاحظات مطلوب",

        dateTaskValidation: "تاريخ الاجازة مطلوب",
        labelRadioButton: "صاحب الطلب",
        firstRadio: "لنفسي",
        secondRadio: "لموظف",
        titleEmployeeId: "الموظف <span class='color-red'>*</span>",
        placeholderEmployeeId: "الموظف",
        EmployeeIdValidation: "الموظف مطلوب",
        uploadFile: "ارفاق صورة",
        chooseLabel: "اختار صورة ليتم رفعه",
        buttonSend: "إرسال الطلب"
      },
    });
    dialogRefAddCurrency.componentInstance.submitted = true;
    dialogRefAddCurrency.componentInstance.editUser = true;
    dialogRefAddCurrency.componentInstance.id = data.id;

    // dialogRefAddCurrency.componentInstance.list = this.categories;

    dialogRefAddCurrency.componentInstance.submitClicked.subscribe(result => {

      let formData = new FormData();
      formData.append("UpdateUserModelString", JSON.stringify({
        id: data.id,
        IsActive: result.IsActive,
        Name: result.Name,
        EmployeeId: result.EmployeeId.key,
        Email: result.Email,
        MobileNumber: result.MobileNumber,
        Password: result.Password,
        ConfirmPassword: result.ConfirmPassword,
        Roles: result.Roles.map((role: any) => role.key),
        IsAdmin: Array.isArray(result.IsAdmin) ? result.IsAdmin[0] : result.IsAdmin
      }));
      result.files.forEach((file: any) => {
        if (file.detailsImage === false) {
          formData.append("ProfileImageFile", file.fileUpload, file.fileUpload.name);
        }
      });
      dialogRefAddCurrency.componentInstance.submitted = false;
      dialogRefAddCurrency.componentInstance.loading = true;

      this.usersService.updateUser(formData).subscribe(
        {
          next: (data: any) => {


            dialogRefAddCurrency.componentInstance.submitted = true;

            dialogRefAddCurrency.close();

            const succressDialog = this.dialog.open(ToastSuccessComponent, {
              width: "30vw",
              data: {
                title: "تم ارسال طلبك",
                message: data.message,
                buttonSend: "طلبات المستخدمين"

              },
            });
            this.getUsers(this.filteration);

            setTimeout(() => {
              succressDialog.close();

            }, 2000);
            succressDialog.componentInstance.submitted = true;
            dialogRefAddCurrency.componentInstance.loading = false;

            succressDialog.componentInstance.submitClicked.subscribe(result => {
              succressDialog.close();
            })

          },
          error: (err: any) => {
            dialogRefAddCurrency.componentInstance.loading = false;

            dialogRefAddCurrency.componentInstance.submitted = true;

          }
        }
      )
    });
    dialogRefAddCurrency.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }


  dialogUserFile(data: any) {
    const dialogRefAddCurrency = this.dialog.open(DialogUserFileComponent, {
      width: "60vw",
      data: {
        title: "ملف المستخدم"
      },
    });
    dialogRefAddCurrency.componentInstance.id = data.id

  }


  onPageChange(event: any) {
    this.filteration = { ...this.filteration, PageNumber: event.page };
    this.getUsers(this.filteration)
  }
  minimumValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      let checkMin = true;
      if (value != null) {

        if (this.filterForm.get(conInput)?.dirty && !this.filterForm.get(conInput)?.hasError('required')) {
          if (value > this.filterForm.get(conInput)?.value) {
            checkMin = false;
          }
        }
      }
      // const hasNumber = /\d/.test(value);
      return checkMin ? null : { numberIsBig: true };

    };
  }
  maximumValidator(conInput: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value: string = control.value;
      let checkMin = true;

      if (value != null) {
        if (this.filterForm.get(conInput)?.dirty && !this.filterForm.get(conInput)?.hasError('required')) {
          if (value < this.filterForm.get(conInput)?.value) {
            checkMin = false;
          }
        }
      }
      // const hasNumber = /\d/.test(value);
      return checkMin ? null : { numberIsLess: true };
    };
  }
  changePage(even: number) {

    // if (this.filteration.page < even) {
    //   if (this.page === 0) {
    //     if (this.filteration.page + 1 < even) {
    //       let minusCurrentPage = even - this.filteration.page;
    //       this.page += this.itemsPerPage * minusCurrentPage;
    //     } else {
    //       this.page = this.itemsPerPage;
    //     }
    //   } else {
    //     if (this.filteration.page + 1 < even) {
    //       let minusCurrentPage = even - this.filteration.page;
    //       this.page += this.itemsPerPage * minusCurrentPage;

    //     } else {
    //       this.page += this.itemsPerPage;

    //     }
    //   }
    // } else {
    //       //   if (this.filteration.page > even + 1) {
    //     let minusCurrentPage = this.filteration.page - even;
    //     this.page -= this.itemsPerPage * minusCurrentPage;

    //   } else {
    //     this.page -= this.itemsPerPage;

    //   }
    //   this.page -= this.itemsPerPage;
    // }

    this.filteration.page = even;
    let filteration = { ...this.filteration, page: even - 1 };
    // this.getListTransaction(filteration)

  }
  changeLang(lang: string) {
    this.translate.use(lang);
  }
  searchKeyword(val: any) {

    // this.filteration.searchKey = val;
    // this.FLS(this.filteration);
  }
}
