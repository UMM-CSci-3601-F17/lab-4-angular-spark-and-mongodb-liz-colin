import {browser, element, by} from 'protractor';
import {Key} from "selenium-webdriver";

export class TodoPage {
    navigateTo() {
        return browser.get('/todos');
    }

    //http://www.assertselenium.com/protractor/highlight-elements-during-your-protractor-test-run/
    highlightElement(byObject) {
        function setStyle(element, style) {
            const previous = element.getAttribute('style');
            element.setAttribute('style', style);
            setTimeout(() => {
                element.setAttribute('style', previous);
            }, 200);
            return "highlighted";
        }

        return browser.executeScript(setStyle, element(byObject).getWebElement(), 'color: red; background-color: yellow;');
    }

    getTodoTitle() {
        let title = element(by.id('title')).getText();
        this.highlightElement(by.id('title'));

        return title;
    }

    filterByOwner(name: string) {
        let input = element(by.id('todoOwner'));
        input.click();
        input.sendKeys(name);

    }

    grabACategory(category: string) {
        let input = element(by.id('categories'));
        input.click();
        input.sendKeys(category);
        this.pressEnter();
        this.toggleSearch();
    }

    selectStatus(status: string) {
        let input = element(by.id('status'));
        input.click();
        input.sendKeys(status);
        this.pressEnter();
    }


    filterByContent(content: string) {
        let input = element(by.id('content'));
        input.click();
        input.sendKeys(content);
    }

    toggleSearch() {
        let input = element(by.id('load-button'));
        input.click();

    }

    addTodo(owner: string, status: string, content: string, category:string) {
        let input = element(by.tagName("input"));
        input.click();
        input.sendKeys(owner, Key.TAB, status, Key.TAB, content, Key.TAB, category, Key.TAB, Key.ENTER);
    }

    pressEnter() {
        browser.actions().sendKeys(Key.ENTER).perform();
    }


    getFilterInterface(ui: string) {
        let userInterface = element(by.id(ui)).getText();
        this.highlightElement(by.id(ui));

        return userInterface;
    }


    getFirstTodo() {
        let todo = element(by.id('subject-line')).getText();
        return todo;
    }
}
