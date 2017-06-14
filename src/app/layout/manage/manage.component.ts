import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { NgbModule, ModalDismissReasons, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from "rxjs/Observable";

import { UserManageService, ContestInfoService } from '../../shared/services';
import { UserInterface, ContestInfoInterface } from '../../models';

@Component({
    selector: 'ngbd-modal-content',
    template: `
    <div class="modal-header">
      <h4 class="modal-title">Response</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>{{type}}! {{message}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})
export class NgbdModalContent {
    @Input() name;

    constructor(public activeModal: NgbActiveModal) { }
}

@Component({
    selector: 'app-manage',
    templateUrl: './manage.component.html',
    providers: [
        UserManageService,
        ContestInfoService,
    ],
    styleUrls: ['./manage.component.scss']
})
export class ManageComponent implements OnInit, OnDestroy {
    users: UserInterface[] = [];
    isUploading: boolean = false;
    uploadMsg: string = '';
    private subscription: Subscription;
    searchText: string = '';
    contestInfo: ContestInfoInterface = {
        StartTime: "",
        GoldMedalNum: 0,
        SilverMedalNum: 0,
        BronzeMedalNum: 0,
        Duration: 0,
    };

    isEdit: boolean = false;
    testName: string = '';

    constructor(
        private userUserManageService: UserManageService,
        private contestInfoService: ContestInfoService,
        private modalService: NgbModal,
    ) { }

    private updateUsers() {
        this.userUserManageService.getAllUser()
            .subscribe({
                next: (result: UserInterface[]) => {
                    console.log('getAllUser observer got a next value: ', result);
                    this.users = result.sort((u1, u2) => u1.Account < u2.Account ? -1 : 1);
                },
                error: err => {
                    console.error('getAllUser observer got an error: ', err);
                },
                complete: () => console.log('getAllUser observer got a complete notification')
            });
    }

    ngOnInit() {
        let timer = TimerObservable.create(0, 1500);
        this.subscription = timer.subscribe(() => {
        });

        this.updateUsers();
        this.contestInfoService.getContestInfo()
            .subscribe({
                next: (result: ContestInfoInterface) => {
                    console.log('getContestInfo observer got a next value: ', result);
                    this.contestInfo = result;
                },
                error: err => {
                    console.error('getContestInfo observer got an error: ', err);
                },
                complete: () => console.log('getContestInfo observer got a complete notification')
            });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    open(type: string, message?: any) {
        const modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.type = type;
        modalRef.componentInstance.message = message;
    }

    search = (text$: Observable<string>) =>
        text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => {
                if (term.length < 2) {
                    return [];
                } else {
                    let dict: Array<string> = [];
                    let forbid: Array<string> = ["Password", "TeamKey"];
                    this.users.forEach(user => {
                        for (var attr in user) {
                            if (forbid.indexOf(attr) > -1) {
                                continue;
                            }
                            if (typeof user[attr] != 'string') {
                                continue;
                            }
                            dict.push(user[attr]);
                        }
                    });
                    dict = dict.filter((item, pos) => dict.indexOf(item) == pos);

                    return dict
                        .filter(word => word.toLowerCase().indexOf(term.toLowerCase()) > -1)
                        .slice(0, 10);
                }
            });

    contestInfoChange(event) {
        this.contestInfoService.saveContestInfo(this.contestInfo)
            .subscribe({
                next: (result: number) => {
                    console.log('saveContestInfo observer got a next value: ', result);
                },
                error: err => {
                    console.error('saveContestInfo observer got an error: ', err);
                },
                complete: () => {
                    console.log('saveContestInfo observer got a complete notification');
                }
            });
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            console.log(this.isUploading);
            this.isUploading = true;
            this.uploadMsg = 'uploading...';
            // this.uploadPopover.hidden;

            this.userUserManageService.postUserList(file)
                .subscribe({
                    next: (result: number) => {
                        console.log('postUserList observer got a next value: ', result);
                        this.isUploading = false;
                        this.updateUsers();
                        this.uploadMsg = 'Upload Success';
                    },
                    error: err => {
                        console.error('postUserList observer got an error: ', err);
                        this.isUploading = false;
                        this.uploadMsg = 'Upload Failed';
                        this.open('Errror', err);
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
