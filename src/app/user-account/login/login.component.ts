import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginData = {
    userName: '',
    password: ''
  };

  message: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // If user is already logged in, redirect to home
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
  }

  onLogin() {
    this.http.post<any>('https://localhost:7213/api/User/Login', this.loginData)
      .subscribe({
        next: (response: ResponseResult) => {
          if (response.success) {
            this.message = 'Login successful!';
            this.authService.setToken(response.resultData);
            this.router.navigate(['/home']);
          } else {
            this.message = response.message || 'Login failed';
          }
        },
        error: (error) => {
          this.message = 'Login failed: ' + (error.error?.message || 'Unknown error');
          console.error(error);
        }
      });
  }
}

export class ResponseResult {
  message!: string;
  success!: boolean;
  resultData!: string;
}
