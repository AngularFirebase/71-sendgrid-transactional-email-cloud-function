import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  endpoint = 'https://us-central1-firestarter-96e46.cloudfunctions.net/httpEmail';

  constructor(private http: HttpClient) { }

  ngOnInit() { }

  sendEmail() {
    const data = {
      toEmail: 'hello@jeffdelaney.me',
      toName: 'Jeff Delaney'
    }

    this.http.post(this.endpoint, data).subscribe()

  }


}