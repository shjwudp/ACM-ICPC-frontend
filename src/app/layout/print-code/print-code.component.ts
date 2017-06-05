import { Component, OnInit } from '@angular/core';

import { PrinterService } from '../../shared/services';

@Component({
    selector: 'app-print-code',
    templateUrl: './print-code.component.html',
    styleUrls: ['./print-code.component.scss'],
    providers: [PrinterService]
})
export class PrintCodeComponent implements OnInit {
    hint: string = 'Paste Code Here';
    hintClass: string = 'alert alert-info';
    alert = { 'type': 'info', 'message': 'Paste Code Here.' };
    isBusy = false;

    constructor(
        private printerService: PrinterService
    ) { }

    ngOnInit() { }

    onSendPrintContent(printContent: string) {
        this.isBusy = true;
        this.hint = 'Uploading...';
        setTimeout(() => this.printerService.postPrinter(printContent)
            .subscribe({
                next: result => {
                    console.log('postPrinter observer got a next value: ', result);
                    this.alert = {
                        'type': 'success',
                        'message': 'Upload Success! ' + result["queue_size"] + " task in print queue",
                    };
                },
                error: err => {
                    console.error('postPrinter observer got an error:', err);
                    this.alert = {
                        'type': 'danger',
                        'message': 'Error',
                    };
                },
                complete: () => {
                    console.log('postPrinter observer got a complete notification');
                    this.isBusy = false;
                }
            }), 500);
    }
}
