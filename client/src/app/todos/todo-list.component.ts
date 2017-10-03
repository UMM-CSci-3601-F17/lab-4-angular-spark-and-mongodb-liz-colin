import {Component, OnInit} from '@angular/core';
import {TodoListService} from "./todo-list.service";
import {Todo} from "./todo";

@Component({
    selector: 'todo-list-component',
    templateUrl: 'todo-list.component.html',
    styleUrls: ['./todo-list.component.css'],
    providers: []
})

export class TodoListComponent implements OnInit {
    //These are public so that tests can reference them (.spec.ts)
    public todos: Todo[];
    public filteredTodos: Todo[];
    private todoAddSuccess: Boolean = false;

    public todoOwner: string;
    public todoStatus: boolean;

    public newTodoOwner: string;
    public newTodoStatus: string;
    public newTodoContent: string;
    public newTodoCategory: string;
    public boolStatus: boolean;

    public loadReady: boolean = false;


    //Inject the TodoListService into this component.
    //That's what happens in the following constructor.
    //
    //We can call upon the service for interacting
    //with the server.
    constructor(public todoListService: TodoListService) {

    }

    addNewTodo(owner: string, status: string, content: string, category: string): void {

        //Here we clear all the fields, there's probably a better way
        //of doing this could be with forms or something else
        this.newTodoOwner = null;
        this.newTodoStatus = null;
        this.newTodoContent = null;
        this.newTodoCategory = null;

        this.boolStatus = (status === "true");

        this.todoListService.addNewTodo(owner, this.boolStatus, content, category).subscribe(
            succeeded => {
                this.todoAddSuccess = succeeded;
                // Once we added a new Todo, refresh our todo list.
                // There is a more efficient method where we request for
                // this new todo from the server and add it to todos, but
                // for this lab it's not necessary
                // this.refreshTodos();
                this.boolStatus = null;
            });
    }

    ownerChange(ownerString): void {
        this.todoListService.serviceOwner = ownerString;
    }

    statusChange(statusString): void {
        this.todoListService.serviceStatus = statusString;
    }

    contentChange(contentString): void {
        this.todoListService.serviceContent = contentString;
    }


    public filterTodos(searchOwner: string, searchStatus: string): Todo[] {

        this.filteredTodos = this.todos;

        //Filter by owner
        if (searchOwner != null) {
            searchOwner = searchOwner.toLocaleLowerCase();

            this.filteredTodos = this.filteredTodos.filter(todo => {
                return !searchOwner || todo.owner.toLowerCase().indexOf(searchOwner) !== -1;
            });
        }

        //Filter by status
        if (searchStatus != null) {
            this.filteredTodos = this.filteredTodos.filter(todo => {
                return todo.status.toString().indexOf(searchStatus) !== -1;
            });
        }

        return this.filteredTodos;
    }

    /**
     * Starts an asynchronous operation to update the todos list
     *
     */
    refreshTodos(): void {
        //Get Todos returns an Observable, basically a "promise" that
        //we will get the data from the server.
        //
        //Subscribe waits until the data is fully downloaded, then
        //performs an action on it (the first lambda)
        this.todoListService.getTodos().subscribe(
            todos => {
                this.todos = todos;
       //         this.filterTodos(this.todoOwner, this.todoStatus.toString());
                // ****************************** Is this correct? ^ ***************************//
            },
            err => {
                console.log(err);
            });
    }

    loadService(): void {
        console.log("yay");
        this.loadReady = true;
        this.todoListService.getTodos().subscribe(
            todos => {
                this.todos = todos;
                this.filteredTodos = this.todos;
            },
            err => {
                console.log(err);
            }
        );
    }

    ngOnInit(): void {
        this.refreshTodos();
    }
}
