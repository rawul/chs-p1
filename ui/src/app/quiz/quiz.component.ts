import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AllService } from '../all.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  surveyId = "";
  responses = {
    name: "",
    email: "",
    answers: []
  };
  selectedSurvey: any = {};
  constructor(
    private route: ActivatedRoute,
    private serv: AllService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(p => {
      this.surveyId = p['id'];
      this.serv.getSurvey(this.surveyId).subscribe((x: any) => {
        this.selectedSurvey = x;
        this.responses.answers = this.selectedSurvey.surveyQuestions.map(x => {
          return {
            value: x.type == "MultipleChoice" ? [] : '',
            _id: x._id
          }
        });
      })
    });
  }

  selectAnswer(qIndex, response) {
    if (this.selectedSurvey.surveyQuestions[qIndex].type == "Open") {
      this.responses.answers[qIndex].value = response;
    }
    if (this.selectedSurvey.surveyQuestions[qIndex].type == "SingleChoice") {
      this.responses.answers[qIndex].value = response;
    }
    if (this.selectedSurvey.surveyQuestions[qIndex].type == "MultipleChoice") {
      if (this.responses.answers[qIndex].value === []) {
        this.responses.answers[qIndex].value = [response];
      } else {
        if (this.responses.answers[qIndex].value.find(r => r == response) === undefined) {
          this.responses.answers[qIndex].value.push(response);
        }
        else
          this.responses.answers[qIndex].value = this.responses.answers[qIndex].value.filter(x => x != response);
      }
    }
  }

  isAnswerSelected(qIndex, response) {
    if (this.selectedSurvey.surveyQuestions[qIndex].type == 'MultipleChoice')
      return this.responses.answers[qIndex].value.find(x => x == response) !== undefined;
    else
      return this.responses.answers[qIndex].value == response;
  }

  sendResponse() {
    console.log(this.responses);
    this.serv.postAnswer(this.responses, this.selectedSurvey._id).subscribe(x => {
      console.log(x);
    })
  }
}
