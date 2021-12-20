import View from './View.js';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goTo;

      handler(goToPage);
    });
  }

  _generateMarkup() {
    const { page, results, resultsPerPage } = this._data;

    const totalPages = Math.ceil(results.length / resultsPerPage);

    switch (true) {
      case page === 1:
        if (page === totalPages) return '';
        return `
          <button class="btn--inline pagination__btn--next" data-go-to=${
            page + 1
          }>
            <span>page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `;

      case page === totalPages:
        return `
          <button class="btn--inline pagination__btn--prev" data-go-to=${
            page - 1
          }>
            <span>page ${page - 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
          </button>
        `;

      default:
        return `
          <button class="btn--inline pagination__btn--prev" data-go-to=${
            page - 1
          }>
            <span>page ${page - 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
          </button>
          <button class="btn--inline pagination__btn--next" data-go-to=${
            page + 1
          }>
            <span>page ${page + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
        `;
    }
  }
}

export default new PaginationView();
