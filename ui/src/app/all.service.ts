import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter, map, catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class AllService {
    url = 'http://localhost:8085/v1';
    constructor(
        private http: HttpClient,
        private router: Router,
        private snack: MatSnackBar
    ) { }

    login(user) {
        return this.http.post(`${this.url}/auth/login`, user).pipe(
            map((res: any) => {
                localStorage.setItem('token', res.token);
                if (res.role === 'admin') {
                    this.router.navigate(['dashboard', 'users']);
                } else {
                    this.router.navigate(['dashboard', 'surveys']);
                }
                return res;
            }));
    }

    getUsers() {
        return this.http.get(`${this.url}/users`);
    }

    getSurveys() {
        return this.http.get(`${this.url}/surveys`);
    }

    getSurvey(id) {
        return this.http.get(`${this.url}/survey/${id}`);
    }

    getSurveyAnswers(id) {
        return this.http.get(`${this.url}/survey/${id}/answers`);
    }

    postAnswer(a, id) {
        return this.http.post(`${this.url}/answers/${id}`, a).pipe(
            map((res: any) => {
                this.router.navigate(['']);
                this.snack.open("Survey Responded succesfully", "", { duration: 3000 })
                return res;
            }));
    }

    addSurvey(s) {
        return this.http.post(`${this.url}/survey`, s).pipe(
            map((res: any) => {
                this.snack.open("Survey Created succesfully", "", { duration: 3000 })
                return res;
            }));
    }

    addUser(user) {
        return this.http.post(`${this.url}/user`, user).pipe(
            map((res: any) => {
                this.snack.open("Client Created succesfully", "", { duration: 3000 })
                return res;
            }));
    }

    deleteUser(user) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: {
                email: user.email
            }
        }
        return this.http.delete(`${this.url}/user`, options).pipe(
            map((res: any) => {
                this.snack.open("Client Deleted succesfully", "", { duration: 3000 })
                return res;
            }));
    }
}