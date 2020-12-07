import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TimeHelper {

    public secondsToHMS(duration: number) {
        let hours = Math.trunc(duration / 3600);
        let modulus = duration % 3600;
        let minutes = Math.trunc((modulus / 60));
        let seconds = Math.trunc((((modulus / 60) - minutes) * 60));
        return `${this.formatNumberToPrint(hours)}:${this.formatNumberToPrint(minutes)}:${this.formatNumberToPrint(seconds)}`;
    }

    private formatNumberToPrint(numberToFormat: number) {
        return numberToFormat < 10 ? "0" + numberToFormat : numberToFormat;
    }

}