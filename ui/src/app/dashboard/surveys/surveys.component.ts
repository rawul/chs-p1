import { Component, OnInit } from '@angular/core';
import { AllService } from 'src/app/all.service';
import { PDFSource } from 'pdfjs-dist';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private serv: AllService,
    private snack: MatSnackBar,
  ) { }

  ngOnInit() {
    this.getSurveys();

  }

  generateQRf(s) {
    this.serv.getQr(s._id)
      .subscribe((res) => {
        const blob = new Blob([res], { type: 'application/pdf' })
        const blobURL = window.URL.createObjectURL(blob);
        const tmpa = document.createElement('a');
        tmpa.style.display = 'none';
        tmpa.href = blobURL;
        tmpa.target = "_blank";
        tmpa.setAttribute('download', `survey-${s._id}.pdf`);
        document.body.appendChild(tmpa);
        tmpa.click();
        document.body.removeChild(tmpa);
      });
  }

  viewStatistics(s) {
    this.serv.getSurveyAnswers(s._id).subscribe(x => {
      this.statistics = x;
      this.generateQR = false;
      if (this.statistics.length === 0) {
        this.snack.open('There are no answers for this survey yet !');
      }
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
    console.log(this.newSurvey);
    this.newSurvey.questions.push({
      question: '',
      type: 'Open',
      choices: []
    });
  }


}
