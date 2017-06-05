import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../shared/services'

export class LoginForm {
    account: string;
    password: string;
}

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loading = false;
    hint: string = 'login form';
    hintClass: string = 'alert alert-info';
    error: Error = new Error();
    loginForm: LoginForm = new LoginForm();

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router) { }

    ngOnInit() {
        this.authenticationService.logout();
    }

    onLoggedin() {
        this.loading = true;
        this.authenticationService.login(this.loginForm.account, this.loginForm.password)
            .subscribe({
                next: (result: Boolean) => {
                    console.log('login observer got a next value: ' + result);
                    if (result == true) {
                        this.router.navigate(['/']);
                        this.hint = 'Authentication success! redriecting..'
                        this.hintClass = 'alert alert-success';
                    } else {
                        this.hint = 'Account or password is incorrect';
                        this.hintClass = 'alert alert-warning';
                        this.loading = false;
                    }
                },
                error: (err: any) => {
                    console.error('login observer got an error:', err);
                    this.hint = err;
                    this.hintClass = 'alert alert-danger';
                },
                complete: () => console.log('login observer got a complete notification')
            });
    }

}
