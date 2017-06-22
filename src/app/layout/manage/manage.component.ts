import {
    Component,
    OnInit,
    OnDestroy,
    Input,
    ViewChild,
    ElementRef
} from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule, ModalDismissReasons, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from "rxjs/Observable";

import { UserManageService, ContestInfoService } from '../../shared/services';
import { UserInterface, ContestInfoInterface } from '../../models';


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
    private uploadState = {
        IsUploading: false,
        Hint: ""
    };
    private subscription: Subscription;
    searchText: string = '';
    contestInfo: ContestInfoInterface = {
        StartTime: "",
        GoldMedalNum: 0,
        SilverMedalNum: 0,
        BronzeMedalNum: 0,
        Duration: 0,
    };
    private modalParam = {
        Title: "Modal Title",
        Message: "Modal Message",
    };
    @ViewChild('modalTemplate') modalTemplate: ElementRef;

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

    showModal(Title: string, Message: string) {
        this.modalParam = {
            Title: Title,
            Message: Message
        };
        this.modalService.open(this.modalTemplate);
    }

    fileChange(event) {
        let fileList: FileList = event.target.files;
        if (fileList.length > 0) {
            let file: File = fileList[0];
            this.uploadState = {
                IsUploading: true,
                Hint: "uploading..."
            };

            this.userUserManageService.postUserList(file)
                .subscribe({
                    next: (result: number) => {
                        console.log('postUserList observer got a next value: ', result);
                        this.updateUsers();
                        this.uploadState = {
                            IsUploading: false,
                            Hint: "Upload Success"
                        };
                    },
                    error: err => {
                        console.error('postUserList observer got an error: ', err);
                        this.uploadState = {
                            IsUploading: false,
                            Hint: "Upload Failed"
                        };
                        this.showModal("Error", err.toString())
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
