import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {

    initContext(contextData: any) {
        localStorage.setItem('context', JSON.stringify(contextData));
    }

    loadStorageData() {
        return localStorage.getItem('context');
    }

    setStorageData(identificator: string, data: any) {
        let context = JSON.parse(this.loadStorageData());
        context[identificator] = data;    
        localStorage.setItem('context', JSON.stringify(context));
    }

    getStorageData(identificator) {
        let context = JSON.parse(this.loadStorageData());
        let dataToReturn = context[identificator];
        return dataToReturn;
    }

}