import {TodoPage} from './todo-list.po';
import {browser, protractor} from 'protractor';

describe('angular-spark-mongo-lab', () => {
    let page: TodoPage;

    beforeEach(() => {
        page = new TodoPage();
    });

    /* This test requires an actual title for it to check

    it('should get and highlight Tasks attribute ', () => {
        page.navigateTo();
        expect(page.getTodoTitle()).toEqual('Tasks');
    });
*/

    it('should type something in the Owner box and check that it returned correct element', () => {
        page.navigateTo();
        page.typeAnOwner("workman");
        page.toggleSearch();
        expect(page.getFirstTodo()).toEqual("Workman has completed this software design task:");
    });

/* These tests were written for category filtering which is not currently implemented


    it('Should select a category and check that it returned correct element', () => {
        page.navigateTo();
        page.grabACategory('homework');
        expect(page.getFirstTodo()).toEqual("Fry has completed this homework task:");
    });

    it('Should select a category and check that it returned correct element', () => {
        page.navigateTo();
        page.grabACategory('software design');
        expect(page.getFirstTodo()).toEqual("Blanche has not completed this software design task:");
    });

    it('Should select a category and check that it returned correct element', () => {
        page.navigateTo();
        page.grabACategory('groceries');
        expect(page.getFirstTodo()).toEqual("Blanche has completed this groceries task:");
    });

    it('Should select a category and check that it returned correct element', () => {
        page.navigateTo();
        page.grabACategory('video games');
        expect(page.getFirstTodo()).toEqual("Fry has not completed this video games task:");
    });
*/
    it('Should select true for status and have the completed todos appear on the page', () => {
        page.navigateTo();
        page.selectStatus('Complete');
        page.toggleSearch();
        expect(page.getFirstTodo()).toEqual("Fry has completed this homework task:")
    });

    it('Should select false for status and have the incomplete todos appear on the page', () => {
        page.navigateTo();
        page.selectStatus('Incomplete');
        page.toggleSearch();
        expect(page.getFirstTodo()).toEqual("Blanche has not completed this software design task:")
    });

    it('Should only return todos that contain particular content', () => {
        page.navigateTo();
        page.filterByContent('Excepteur');
        page.toggleSearch();
        expect(page.getFirstTodo()).toEqual("Blanche has not completed this homework task:")
    });

    it('Should correctly return todos that are filtered by multiple properties', () => {
        page.navigateTo();
        page.filterByContent('velit');
        page.selectStatus('Complete');
        page.typeAnOwner('Workman');
        //page.grabACategory('software design'); (change to 'Workman has completed this software design task:' if we implement category)
        page.toggleSearch();
        expect(page.getFirstTodo()).toEqual('Workman has completed this groceries task:')
    });

    it('Should have an owner filter box', () => {
        page.navigateTo();
        expect(page.getFilterInterface('todoOwner')).toEqual("")
    });

    it('Should have an content filter box', () => {
        page.navigateTo();
        expect(page.getFilterInterface('content')).toEqual("")
    });

    /*
    Note that to make it easier to test the existence of the category and status dropdowns,
    we checked that an option inside of these elements was accessible.
     */

    /*
    it('Should have a category dropdown element', () => {
        page.navigateTo();
        expect(page.getFilterInterface('homework')).toEqual("Homework")
    });
*/
    it('Should have a status dropdown element', () => {
        page.navigateTo();
        expect(page.getFilterInterface('true')).toEqual("Complete")
    });

    it('Should have a Search button for submitting filters', () => {
        page.navigateTo();
        expect(page.getFilterInterface('load-button')).toEqual("Search");

    });
});
