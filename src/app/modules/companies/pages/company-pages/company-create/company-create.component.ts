import { Component, inject, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { CompaniesService } from 'src/app/modules/companies/companies.service';
import { CompanyRequest, CompanyResponse } from 'src/app/modules/companies/models/ApiModelsCompanies';
import { RolesResponse, UsersResponse } from 'src/app/modules/users/models/ApiModelUsers';
import { UsersService } from 'src/app/modules/users/users.service';
import { typeToast } from 'src/app/modules/accounting/models/models';
import { PeriodModel } from 'src/app/modules/accounting/models/PeriodModel';
import { ToastType } from 'devextreme/ui/toast';

@Component({
  selector: 'app-company-create',
  templateUrl: './company-create.component.html',
  styleUrl: './company-create.component.css',
})
export class CompanyCreateComponent implements OnInit {
  accountsFromSystem: boolean = true;

  companyList$: Observable<CompanyResponse[]> | undefined;
  userList$: Observable<UsersResponse[]> | undefined;
  companyForm: CompanyRequest;

  messageToast: string = '';
  showToast: boolean = false;
  toastType: ToastType = typeToast.Info;
  rolesList$: RolesResponse[] = [];

  @Input('id') id?:number;


  private readonly companyService = inject(CompaniesService);
  private readonly userService = inject(UsersService);

  constructor() {
    this.companyForm = {
      isActive: true,
      address: "",
      description: "",
      email: "",
      name: "",
      phone: "",
      roles: [],
      rtn: "",
      type: "",
      website: "",
      permissions: [1, 2, 3]
    }
  }

  ngOnInit(): void {
    this.companyList$ = this.companyService.getAllCompanies();
    this.userList$ = this.userService.getAllUsers();

    this.userService.getAllRoles().subscribe(
      data => {
        this.rolesList$ = data.map(roles => {
          roles.active = false;
          return roles
        })
      });;

      if (this.id) {
        this.companyService.getCompanyById(Number(this.id)).subscribe(data=>{
          this.companyForm={
            address:data.address,
            description:data.description,
            email:data.email,
            isActive:data.active,
            name:data.name,
            permissions:data.permissions,
            phone:data.phone,
            roles:data.roles,
            rtn:data.rtn,
            type:data.type,
            createdAt:data.createdAt,
            id:data.id,
            tenantId:data.tenantId,
            website:data.website
          }
        })
      }
  }
  onAccountConfig(event: Event) {
    const data = event.target as HTMLInputElement;
    this.accountsFromSystem = Boolean(parseInt(data.value));
  }




  save(e: NgForm) {
    if (e.valid) {
      if (this.companyForm.tenantId == undefined) {
        this.companyForm = {
          ...this.companyForm, ...this.companyForm.tenantId
        }
      }
      const roles = this.rolesList$.filter(roles=> roles.active== true);
      this.companyForm.roles = roles;

      if (this.companyForm.roles.length ==0) {
        this.toastType = typeToast.Error;
        this.messageToast = 'Seleccione al menos un Rol';
        this.showToast = true;
        return
      }
    
      this.companyService.createCompany(this.companyForm).subscribe({
        next: (data) => {
          this.toastType = typeToast.Success;
          this.messageToast = 'Emrpresa registrada exitosamente';
          this.showToast = true;
          setTimeout(() => {
            this.goBack();
          }, 1000);

        },
        error: (err) => {
          console.error('Error creando Empresa:', err);
          this.toastType = typeToast.Error;
          this.messageToast = 'Error al crear el periodo';
          this.showToast = true;
        },
      });
    }

  }

  goBack() {
    window.history.back();
  }
}
