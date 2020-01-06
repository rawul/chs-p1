import { Component, OnInit } from '@angular/core';
import { AllService } from 'src/app/all.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.sass']
})
export class UsersComponent implements OnInit {
  showUserForm = false;
  user = {
    email: "",
    password: ""
  };
  users: any = [];
  constructor(private serv: AllService) { }

  ngOnInit() {
    console.log('initer')
    this.getUsers();
  }

  getUsers() {
    this.serv.getUsers().subscribe(x => {
      this.users = x;
    })
  }

  addNewUser() {
    this.serv.addUser(this.user).subscribe(x => {
      console.log(x);
      this.getUsers();
    })
  }

  deleteUser(us) {
    this.serv.deleteUser({ email: us.email }).subscribe(x => {
      console.log(x);
      this.getUsers();
    });
  }

}
