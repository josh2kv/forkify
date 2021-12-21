# Forkify

https://josh2kv.github.io/forkify/
![image](https://user-images.githubusercontent.com/79514508/146728707-624debc0-05be-4687-ac1f-fd6de9e1434e.png)

## 1. 소개 및 특징

- Vanilla JavaScript를 이용한 MVC패턴의 SPA
- [Forkify API][2]를 이용하여 레시피를 검색, 등록, 북마크

  > 학습자료
  >
  > - [The Complete JavaScript Course: From Zero to Expert!][1]

## 2. 사용기술

- HTML
- CSS
  - SCSS
- JavaScript
- Parcel

## 3. 학습후기

- MVC패턴 학습 및 구현

  ```
  Forkify
  │   index.html
  │
  └───src
  │   │
  │   └───img
  │   │
  │   └───js
  │   |   │   controller.js
  │   |   │   model.js
  │   |   │   helpers.js
  │   |   │   config.js
  │   |   │
  │   │   └───views
  │   |       |   View.js
  │   |       |   addRecipeView.js
  │   |       |   bookmarkView.js
  │   |       |   paginationView.js
  │   |       |   previewView.js
  │   |       |   recipeView.js
  │   |       |   resultsView.js
  │   |       |   searchView.js
  │   │
  │   └───sass
  │       │   main.scss
  │       │   _base.scss
  │       │   ...
  │
  └───dist
      │   ...

  ```

  - React를 공부하면서 갸우뚱했던 부분들이 많이 와닫게 됨(React와 같은 라이브러리가 등장한 이유, 상태관리, View의 컴포넌트화 등)<br/><br/>

- Publisher-Subscriber 패턴

  - EventListener는 View에서 element에 붙어야 하고, callback function는 Controller에 있는 controller function이 맡아야 함
  - Controller는 View와 Model을 알아도 View와 Model은 서로와 Controller를 모르게 (View와 Model은 Controller의 함수 import 불가)
  - 따라서 View에 있는 EventListener에서 controller에 있는 controller function을 직접 import하여 등록하지 않음
  - 그렇다고 Controller에 eventListener를 두는 것도 MVC에 어긋남 <br/><br/>

  ```js
  // (x)
  // in Controller
  ['hashchange', 'load'].map(ev => window.addEventListener(ev, controlRecipe));

  // (o)
  // in View
  addHandlerRender(handler) {
    ['hashchange', 'load'].map(ev => window.addEventListener(ev, handler))
  }
  // in Controller
  const init = function () {
    recipeView.addHandlerRender(controlRecipe);
  };
  init();
  ```

- Update 알고리즘

  - React처럼 Virtual DOM을 만들어서 기존 DOM과 비교한 뒤 바뀐 부분만 변경
  - Range.createContextualFragment() : The createContextualFragment method is useful if you want to create a DocumentFragment object with initial content. If you want to build a DocumentFragment object from the contents of a Range object, use the cloneContents method.
  - string -> object(DOM) -> array<br/><br/>

  ```js
  const newMarkup = this._generateMarkup();

  const newDOM = document.createRange().createContextualFragment(newMarkup);
  const newElements = Array.from(newDOM.querySelectorAll('*'));
  const curElements = Array.from(this._parentElement.querySelectorAll('*'));

  newElements.forEach((newEl, i) => {
    const curEl = curElements[i];

    // element 내에 변화(attribute or text)가 있고, 해당 element에 text가 있는 경우
    // txt 있지만 안 변했고, attr만 변한 경우에도 여기 걸림. 개선 필요
    if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '')
      curEl.textContent = newEl.textContent;

    if (!newEl.isEqualNode(curEl)) {
      Array.from(newEl.attributes).forEach(attr => {
        curEl.setAttribute(attr.name, attr.value);
      });
    }
  });
  ```

[1]: https://www.udemy.com/course/the-complete-javascript-course/
[2]: https://forkify-api.herokuapp.com/v2
