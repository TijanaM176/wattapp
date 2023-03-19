import { Component, OnInit, Query } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-neighborhood',
  templateUrl: './neighborhood.component.html',
  styleUrls: ['./neighborhood.component.css'],
})
export class NeighborhoodComponent implements OnInit {
  public data: Observable<any>;
  constructor(private http: HttpClient) {
    this.data = this.http
      .get<{ [key: string]: object }[]>(
        'https://services.odata.org/V4/Northwind/Northwind.svc/Customers'
      )
      .pipe(
        map((results: { [key: string]: any }) => {
          return results['value'];
        })
      );
  }
  public remoteFields: Object = { value: 'CustomerID' };

  public remoteWaterMark: string = 'Select a customer';

  ngOnInit() {}
}
