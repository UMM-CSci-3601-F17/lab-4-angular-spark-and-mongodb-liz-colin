import {ComponentFixture, TestBed, async} from "@angular/core/testing";
import {Todo} from "./todo";
import {TodoComponent} from "./todo.component";
import {TodoListService} from "./todo-list.service";
import {Observable} from "rxjs";
//import { PipeModule } from "../../pipe.module";

describe("Todo component", () => {

    let todoComponent: TodoComponent;
    let fixture: ComponentFixture<TodoComponent>;

    let todoListServiceStub: {
        getTodoById: (todoId: string) => Observable<Todo>
    };

    beforeEach(() => {
        // stub TodoService for test purposes
        todoListServiceStub = {
            getTodoById: (todoId: string) => Observable.of([
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
            ].find(todo => todo._id === todoId))
        };

        TestBed.configureTestingModule({
            //imports: [PipeModule],
            declarations: [TodoComponent],
            providers: [{provide: TodoListService, useValue: todoListServiceStub}]
        })
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(TodoComponent);
            todoComponent = fixture.componentInstance;
        });
    }));

    it("can retrieve Patricia by ID", () => {
        todoComponent.setId("pat_id");
        expect(todoComponent.todo).toBeDefined();
        expect(todoComponent.todo.owner).toBe("Patricia");
        expect(todoComponent.todo.category).toBe("software design");
    });

    it("returns undefined for Santa", () => {
        todoComponent.setId("Santa");
        expect(todoComponent.todo).not.toBeDefined();
    });

});











