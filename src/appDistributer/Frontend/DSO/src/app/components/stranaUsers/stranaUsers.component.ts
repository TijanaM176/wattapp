import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-stranaUsers',
  templateUrl: './stranaUsers.component.html',
  styleUrls: ['./stranaUsers.component.css'],
})
export class StranaUsersComponent implements OnInit {
  constructor(private spiner: NgxSpinnerService) {}

  ngOnInit() {
    this.spiner.show();
  }
}
