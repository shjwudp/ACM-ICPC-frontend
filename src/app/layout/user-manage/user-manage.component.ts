import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from "rxjs/Observable";

import { UserManageService } from '../../shared/services';
import { UserInterface } from '../../models';

@Component({
    selector: 'app-user-manage',
    templateUrl: './user-manage.component.html',
    providers: [UserManageService]
})
export class UserManageComponent implements OnInit, OnDestroy {
    users: UserInterface[];
    uploadAlert = { 'type': 'info', 'message': 'Upload user.csv here.' };
    isUploading: boolean = false;
    error: Error = new Error();
    affected: number;
    private subscription: Subscription;

    constructor(
        private userManageService: UserManageService
    ) { }

    ngOnInit() {
        let timer = TimerObservable.create(0, 5000);
        this.subscription = timer.subscribe(() => this.userManageService.getAllUser()
            .subscribe({
                next: (result: UserInterface[]) => {
                    console.log('getAllUser observer got a next value: ', result);
                    this.users = result;
                },
                error: err => {
                    console.error('getAllUser observer got an error: ', err);
                    this.error = err;
                },
                complete: () => console.log('getAllUser observer got a complete notification')
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            console.log(this.isUploading);
            this.isUploading = true;
            this.userManageService.postUserList(file)
                .subscribe({
                    next: (result: number) => {
                        console.log('postUserList observer got a next value: ', result);
                        this.affected = result;
                        this.isUploading = false;
                        this.uploadAlert = {
                            'type': 'success',
                            'message': 'Update Success! ' + this.affected + ' affected.'
                        };
                    },
                    error: err => {
                        console.error('postUserList observer got an error: ', err);
                        this.isUploading = false;
                        this.uploadAlert = {
                            'type': 'danger',
                            'message': err
                        };
                    },
                    complete: () => {
                        console.log('postUserList observer got a complete notification');
                    }
                });
        }
    }

    onRowClick(event) {
        console.log("event:", event);
    }
}
