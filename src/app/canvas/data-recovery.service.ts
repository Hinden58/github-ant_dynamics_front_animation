import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable()
export class DataRecoveryService {

  constructor(private http: HttpClient) { }

  dataUrl = 'https://b75161f7.ngrok.io/sendjson/';

  getData() {
    return this.http.get(this.dataUrl);
  }
}
