import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    constructor(
        private snack: MatSnackBar,
        private zone: NgZone,

    ) { }
    handleError(error) {
        console.log(error);
        this.zone.run(() => {
            this.snack.open(`ERROR: ${this.mapError(error)}`, "", {
                duration: 3000
            });
        });
    }
    mapError(err) {
        return err.error.errors ? err.error.errors.map(x => x.msg) : err.error.error;
    }
}
