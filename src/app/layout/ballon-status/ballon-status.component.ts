import { Component, OnInit } from '@angular/core';

import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from "rxjs/Observable";

import { BallonStatusService } from '../../shared/services';
import { BallonStatusInterface } from '../../models';

@Component({
    selector: 'app-ballon-status',
    templateUrl: './ballon-status.component.html',
    providers: [BallonStatusService]
})
export class BallonStatusComponent implements OnInit {
    ballonStatusList: BallonStatusInterface[];
    uploadAlert = { 'type': 'info', 'message': 'Upload user.csv here.' };
    markedList: BallonStatusInterface[];
    unmarkedList: BallonStatusInterface[];
    pendingList = [];
    affected: number;
    isCollapsed: false;
    private subscription: Subscription;

    constructor(
        private ballonStatusService: BallonStatusService
    ) { }

    ngOnInit() {
        let timer = Observable.timer(0, 15000);
        this.subscription = timer.subscribe(() => this.ballonStatusService.getAllBallonStatus()
            .subscribe({
                next: (result: BallonStatusInterface[]) => {
                    console.log('getAllBallonStatus observer got a next value: ', result);
                    this.ballonStatusList = result;
                    this.markedList = [];
                    this.unmarkedList = [];
                    for (var x of this.ballonStatusList) {
                        if (x.IsMarked) {
                            this.markedList.push(x);
                        } else {
                            this.unmarkedList.push(x);
                        }
                    }
                    this.markedList = this.markedList.sort((b1, b2) => b1.SolutionTime < b2.SolutionTime ? 1 : -1);
                    this.unmarkedList = this.unmarkedList.sort((b1, b2) => b1.SolutionTime < b2.SolutionTime ? -1 : 1);
                },
                error: err => {
                    console.error('getAllBallonStatus observer got an error: ', err);
                },
                complete: () => console.log('getAllBallonStatus observer got a complete notification')
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    mark(bs: BallonStatusInterface) {
        const index: number = this.unmarkedList.indexOf(bs);
        this.unmarkedList.splice(index, 1);
        this.pendingList.push(bs);
        this.ballonStatusService.patchBallonStatus(bs.TeamKey, bs.ProblemIndex, "mark")
            .subscribe({
                next: (result: number) => {
                    console.log('patchBallonStatus observer got a next value: ', result);
                    const index: number = this.pendingList.indexOf(bs);
                    this.pendingList.splice(index, 1);
                },
                error: err => {
                    console.error('patchBallonStatus observer got an error: ', err);
                },
                complete: () => console.log('patchBallonStatus observer got a complete notification')
            })
    }
}