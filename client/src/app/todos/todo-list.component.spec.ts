import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Todo} from "./todo";
import {TodoListComponent} from "./todo-list.component";
import {TodoListService} from "./todo-list.service";
import {Observable} from "rxjs";
import {FormsModule} from "@angular/forms"; //for [(ngModule)] to not break tests

describe("Todo list", () => {

    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.of([
                {
                    _id: "chris_id",
                    owner: "Chris",
                    status: true,
                    body: "Turn it in!",
                    category: "homework"
                },
                {
                    _id: "pat_id",
                    owner: "Patricia",
                    status: false,
                    body: "Go to class!",
                    category: "software design"
                },
                {
                    _id: "jamie_id",
                    owner: "Jamie",
                    status: true,
                    body: "Manage zenhub issues",
                    category: "software design"
                }
            ])
        };

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [TodoListComponent],
            // providers:    [ TodoListService ]  // NO! Don't provide the real service!
            // Provide a test-double instead
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("contains all the todos", () => {
        expect(todoList.todos.length).toBe(3);
    });

    it("contains a todo with owner 'Chris'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Chris")).toBe(true);
    });

    it("contain a todo with owner 'Jamie'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Jamie")).toBe(true);
    });

    it("doesn't contain a todo owned by 'Santa'", () => {
        expect(todoList.todos.some((todo: Todo) => todo.owner === "Santa")).toBe(false);
    });

    it("has two todos that have been completed", () => {
        expect(todoList.todos.filter((todo: Todo) => todo.status === true).length).toBe(2);
    });

    it("todo list refreshes", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        let newTodos : Todo[] = new Array(1);
        let newTodo : Todo = {_id: "5", owner:"Melbourne", status:false, body:"Pick up sausage", category:"grocery list"};
        newTodos.push(newTodo);
        todoList.todos = newTodos;
        todoList.refreshTodos();
        //expect(todoList.filteredTodos).toBe(newTodos);
    });

    it("todo list filters by owner", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoOwner = "a";
        todoList.refreshTodos(); //The asynchronicity of refreshTodos doesn't seem to effect `expect`
        expect(todoList.filteredTodos.length).toBe(2);
    });

    it("todo list filters by status", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoStatus = true;
        todoList.refreshTodos();
        expect(todoList.filteredTodos.length).toBe(2);
    });

    it("todo list filters by owner and status", () => {
        expect(todoList.filteredTodos.length).toBe(3);
        todoList.todoStatus = false;
        todoList.todoOwner = "i";
        todoList.refreshTodos();
        expect(todoList.filteredTodos.length).toBe(1);
    });

});

describe("Misbehaving Todo List", () => {
    let todoList: TodoListComponent;
    let fixture: ComponentFixture<TodoListComponent>;

    let todoListServiceStub: {
        getTodos: () => Observable<Todo[]>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodos: () => Observable.create(observer => {
                observer.error("Error-prone observable");
            })
        };

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [TodoListComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoListComponent);
            todoList = fixture.componentInstance;
            fixture.detectChanges();
        });
    }));

    it("generates an error if we don't set up a TodoListService", () => {
        // Since the observer throws an error, we don't expect todos to be defined.
        expect(todoList.todos).toBeUndefined();
    });
});
