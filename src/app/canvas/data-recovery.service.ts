import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class DataRecoveryService {

  constructor(private http: HttpClient) { }

  dataUrl = 'https://1fed7dbdc8cd.ngrok.io/sendjson/';

  getData() {
    return this.http.get(this.dataUrl);
  }
}
