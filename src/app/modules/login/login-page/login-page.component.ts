import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/modules/login/auth-service.service';
import { UserInfoService } from 'src/app/shared/userInfo.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export class LoginPageComponent implements OnInit {
  loginForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  private authService = inject(AuthServiceService);
  private readonly router = inject(Router);
  private userInfoService = inject(UserInfoService);
  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe((n) => {
        if (n.active) {
          this.userInfoService.setUserInfo(n);
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }
}
