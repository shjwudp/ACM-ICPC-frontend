import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';

import { Subscription } from "rxjs";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Observable } from "rxjs/Observable";

import { ContestStandingService } from '../../shared/services';
import { ContestStandingInterface } from '../../models';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
    selector: 'app-contest-standing',
    templateUrl: './contest-standing.component.html',
    providers: [ContestStandingService]
})
export class ContestStandingComponent implements OnInit {
    contestStanding: ContestStandingInterface;
    error: Error = new Error();
    private subscription: Subscription;
    stateCtrl: FormControl;
    filteredStates: any;
    searchText: string = '';

    search = (text$: Observable<string>) =>
        text$
            .debounceTime(200)
            .distinctUntilChanged()
            .map(term => {
                if (term.length < 2) {
                    return [];
                } else {
                    return this.contestStanding.TeamStandings
                        .filter(t => t.TeamName.toLowerCase().indexOf(term.toLowerCase()) > -1)
                        .slice(0, 10)
                        .map(t => t.TeamName);
                }
            });
    constructor(
        private contestStandingService: ContestStandingService,
    ) { }

    ngOnInit() {
        let timer = TimerObservable.create(0, 1000);
        this.subscription = timer.subscribe(() => this.contestStandingService.getContestStanding()
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
                    this.error = err;
                },
                complete: () => console.log('getContestStanding observer got a complete notification')
            })
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
