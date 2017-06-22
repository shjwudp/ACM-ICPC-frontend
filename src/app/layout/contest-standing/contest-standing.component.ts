import {
    Component,
    OnInit,
    Pipe,
    PipeTransform,
    ViewChild,
    ElementRef,
    Renderer
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl, SafeStyle } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from "rxjs/Observable";

import { ContestStandingService, ContestInfoService } from '../../shared/services';
import { ContestStandingInterface, ContestInfoInterface } from '../../models';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    selector: 'app-contest-standing',
    templateUrl: './contest-standing.component.html',
    providers: [
        ContestStandingService,
        ContestInfoService,
    ],
    styleUrls: ['./contest-standing.component.scss']
})
export class ContestStandingComponent implements OnInit {
    contestStanding: ContestStandingInterface;
    contestInfo: ContestInfoInterface;
    private subscription: Subscription;
    searchText: string = '';
    private modalParam = {
        Title: "Modal Title",
        Message: "Modal Message",
    };
    @ViewChild('modalTemplate') modalTemplate: ElementRef;
    @ViewChild('rankBoard') rankBoard: ElementRef;

    search = (text$: Observable<string>) =>
        text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => {
                if (term.length < 1) {
                    return [];
                } else {
                    let dict: Array<string> = [];
                    let whiteList: Array<string> = ["TeamName", "School", "NickName",
                        "Coach", "Player1", "Player2", "Player3",];
                    this.contestStanding.TeamStandings.forEach(team => {
                        whiteList.forEach(attr => {
                            if (attr in team && typeof team[attr] === 'string') {
                                dict.push(team[attr]);
                            }
                        });
                    });
                    dict = dict.filter((item, pos) => dict.indexOf(item) == pos);
                    return dict
                        .filter(word => word.toLowerCase().indexOf(term.toLowerCase()) > -1)
                        .slice(0, 10);
                }
            });

    constructor(
        private sanitizer: DomSanitizer,
        private contestStandingService: ContestStandingService,
        private contestInfoService: ContestInfoService,
        private renderer: Renderer,
        private modalService: NgbModal,
    ) { }

    ngOnInit() {
        let timer = TimerObservable.create(0, 8000);
        this.subscription = timer.subscribe(() => {
            this.contestStandingService.getContestStanding()
                .subscribe({
                    next: (result: ContestStandingInterface) => {
                        console.log('getContestStanding observer got a next value: ', result);
                        // order result.StandingsHeader.Problems by problem.ID
                        result.StandingsHeader.Problems = result.StandingsHeader.Problems
                            .sort((p1, p2) => p1.ID < p2.ID ? -1 : 1);
                        // order result.TeamStandings by team.Rank
                        result.TeamStandings = result.TeamStandings
                            .sort((t1, t2) => t1.Rank < t2.Rank ? -1 : 1);
                        for (var t of result.TeamStandings) {
                            t.ProblemSummaryInfos = t.ProblemSummaryInfos
                                .sort((p1, p2) => p1.Index < p2.Index ? -1 : 1);
                        }
                        this.contestStanding = result;
                    },
                    error: err => {
                        console.error('getContestStanding observer got an error: ', err);
                    },
                    complete: () => console.log('getContestStanding observer got a complete notification')
                });
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
        });
    }

    showModal(Title: string, Message: string) {
        this.modalParam = {
            Title: Title,
            Message: Message
        };
        this.modalService.open(this.modalTemplate);
    }

    boardFullScreen() {
        var i = this.rankBoard.nativeElement;
        if (i.requestFullscreen) {
            i.requestFullscreen();
        } else if (i.webkitRequestFullscreen) {
            i.webkitRequestFullscreen();
        } else if (i.mozRequestFullScreen) {
            i.mozRequestFullScreen();
        } else if (i.msRequestFullscreen) {
            i.msRequestFullscreen();
        } else {
            this.showModal("Error", "The browser does not support full screen");
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    spanStyle(rank: number): SafeStyle {
        if (!this.contestInfo) {
            return this.sanitizer.bypassSecurityTrustStyle("color:auto");
        }
        let level1 = this.contestInfo.GoldMedalNum;
        let level2 = level1 + this.contestInfo.SilverMedalNum;
        let level3 = level2 + this.contestInfo.BronzeMedalNum;
        if (rank <= level1) {
            return this.sanitizer.bypassSecurityTrustStyle("color:#FFD700");
        }
        if (rank <= level2) {
            return this.sanitizer.bypassSecurityTrustStyle("color:#C0C0C0");
        }
        if (rank <= level3) {
            return this.sanitizer.bypassSecurityTrustStyle("color:#D98719");
        }
        return this.sanitizer.bypassSecurityTrustStyle("color:auto");
    }

    popoverText(team): string {
        return JSON.stringify({
            "NickName": team.NickName,
            "Coach": team.Coach,
            "Player1": team.Player1,
            "Player2": team.Player2,
            "Player3": team.Player3,
            "SeatID": team.SeatID,
        });
    }
}
