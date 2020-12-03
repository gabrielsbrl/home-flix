import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ServerResponse } from '../shared/interfaces/server-response.interface';
import { HttpService } from '../shared/services/http.service';
import { StorageService } from '../shared/services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private apiUrl = 'http://192.168.0.33:3000';
  public videos: Array<any> = [];

  constructor(private _httpService: HttpService, private _storageService: StorageService) { }

  ngOnInit(): void {
    this._httpService.get(this.apiUrl + '/videos')
      .subscribe(
        (response: ServerResponse) => {
          console.log(response);
          this.videos = response.data;
          this._storageService.initContext({});
          this._storageService.setStorageData('videos', this.videos);
        },
        (error: ServerResponse) => {
          console.log('An error happend! ', error.message);
        }
      )
  }

}
