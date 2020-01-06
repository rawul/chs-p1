import { Component, OnInit } from '@angular/core';
import { AllService } from 'src/app/all.service';
import { PDFSource } from 'pdfjs-dist';

@Component({
  selector: 'app-surveys',
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.sass']
})
export class SurveysComponent implements OnInit {
  newSurvey = null;
  surveys: any = [];
  statistics: any = [];
  generateQR = false;
  pdfSrc: PDFSource = {
    url: 'http://localhost:8085/v1/survey/5e12e1d1a7b5cfc3d7b8e50f/qr',
    httpHeaders: { Authorization: localStorage.getItem('token') }
  }
  constructor(
    private serv: AllService
  ) { }

  ngOnInit() {
    this.getSurveys();

  }

  generateQRf(s) {
    console.log('asdas');
    this.pdfSrc = {
      url: `http://localhost:8085/v1/survey/${s._id}/qr`,
      httpHeaders: { Authorization: localStorage.getItem('token') }
    }
    this.generateQR = true;
  }

  viewStatistics(s) {
    this.serv.getSurveyAnswers(s._id).subscribe(x => {
      this.statistics = x;
      this.generateQR = false;
    })
  }

  getSurveys() {
    this.serv.getSurveys().subscribe(x => {
      console.log(x);
      this.surveys = x;
    })
  }

  generateSurvey() {
    this.newSurvey = {
      name: '',
      description: '',
      active: true,
      questions: []
    };
  }

  setValue(value, q) {
    q.type = value;
  }

  saveSurvey() {
    this.newSurvey.questions.map(x => {
      if (x.type == 'Open')
        x.choices = null;
      else
        x.choices = x.choices.map(c => c.value);
    })
    this.serv.addSurvey(this.newSurvey).subscribe(x => {
      console.log(x);
      this.newSurvey = null;
      this.getSurveys();
    })
  }

  addQuestion() {
    this.newSurvey.questions.push({
      question: '',
      type: 'Open',
      choices: []
    });
  }


}
