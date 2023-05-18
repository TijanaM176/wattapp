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
    let t = window.innerWidth < 320 ? 140.6 : 101;
    let h = window.innerHeight - t;
    document.getElementById('tabelaUsersSidebarCont')!.style.height = h + 'px';
  }
}
