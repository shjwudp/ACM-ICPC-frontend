import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    account: string;

    constructor(private translate: TranslateService) { }

    ngOnInit() {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.account = 'account' in currentUser && currentUser.account;
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('push-right');
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    onLoggedout() {
        localStorage.removeItem('currentUser');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }
}
