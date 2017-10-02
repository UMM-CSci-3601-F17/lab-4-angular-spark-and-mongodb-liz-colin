import {Injectable} from '@angular/core';
import {Http, RequestOptions} from '@angular/http';

import {Observable} from "rxjs";
import "rxjs/add/operator/map";

import {Todo} from './todo';
import {environment} from "../../environments/environment";


@Injectable()
export class TodoListService {
    private todoUrl: string = environment.API_URL + "todos";
    public serviceOwner: string;
    public serviceStatus: string;
    public serviceContent: string;

    constructor(private http: Http) {
    }



    getTodos(): Observable<any> {
        this.todoUrl = environment.API_URL + "todos";
        if (this.serviceOwner !== "") {
            console.log("owner specified");

            if (this.todoUrl.indexOf('&') !== -1) {
                this.todoUrl += 'owner=' + this.serviceOwner + '&';
            }
            else {
                this.todoUrl += "?owner=" + this.serviceOwner + "&";
            }
        }
        if (this.serviceStatus !== "") {
            console.log("status specified");
            if (this.todoUrl.indexOf('&') !== -1) {
                this.todoUrl += 'status=' + this.serviceStatus + '&';
            }
            else {
                this.todoUrl += "?status=" + this.serviceStatus + "&";
            }
        }

        if (this.serviceContent !== "") {
            if (this.todoUrl.indexOf('&') !== -1) {
                this.todoUrl += 'content=' + this.serviceContent + '&';
            }
            else {
                this.todoUrl += "?content=" + this.serviceContent + "&";
            }
            console.log(this.todoUrl);
        }

        let observable: Observable<any> = this.http.request(this.todoUrl);
        return observable.map(res => res.json());
    }




    /*
    getTodos(): Observable<Todo[]> {
        let observable: Observable<any> = this.http.request(this.todoUrl);
        return observable.map(res => res.json());
    }
*/
    getTodoById(id: string): Observable<Todo> {
        return this.http.request(this.todoUrl + "/" + id).map(res => res.json());
    }

    addNewTodo(owner: string, status: boolean, content : string, category : string): Observable<Boolean> {
        const body = {owner:owner, status:status, body:content, category:category};
        console.log(body);

        //Send post request to add a new todo with the todo data as the body with specified headers.
        return this.http.post(this.todoUrl + "/new", body).map(res => res.json());
    }
}




