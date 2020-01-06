import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // 0 - reaspuns deschis
  // 1 - raspuns unic
  // 2 - raspuns multiplu
  selectedSurvey = {
    name: 'Kaulfand Marketing',
    responders: 123,
    endDate: new Date(),
    questions: [{
      text: 'What is your name?',
      type: 0
    }, {
      text: 'Care culoare va place',
      type: 1,
      answers: ['alb', 'verde', 'negru']
    }, , {
      text: 'Care mancare va place',
      type: 2,
      answers: ['pizza', 'paste', 'paine']
    }],
    responses: [{
      answer: 'Raul'
    }, {
      answer: [0]
    }, {
      answer: [0, 2]
    }]
  };
  newSurvey = null;
  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  
  logout() {
    localStorage.clear();
    this.router.navigate(['']);
  }

  viewStatistics() {

  }

}
