export interface ContestStandingInterface {
    XMLName: {
        Space: string,
        Local: string
    },
    StandingsHeader: {
        CurrentDate: string,
        ProblemCount: number,
        ProblemsAttempted: number,
        TotalAttempts: number,
        TotalSolved: number,
        Problems: {
            ID: number,
            NumberSolved: number,
            BestSolutionTime: number,
            LastSolutionTime: number,
            Title: string,
            ShortName: string,
        }[],
    },
    TeamStandings: {
        FirstSolved: number,
        Index: number,
        LastSolved: number,
        Points: number,
        ProblemsAttempted: number,
        Rank: number,
        Solved: number,
        TeamName: string,
        TeamKey: string,
        TotalAttempts: number,
        NickName: string,
        School: string,
        IsStar: boolean,
        IsGirl: boolean,
        Coach: string,
        Player1: string,
        Player2: string,
        Player3: string,
        SeatID: string,
        ProblemSummaryInfos: {
            Index: number,
            Attempts: number,
            IsPending: boolean,
            IsSolved: boolean,
            Points: number,
            SolutionTime: number,
            IsFirstSolved: boolean,
        }[]
    }[]
};
