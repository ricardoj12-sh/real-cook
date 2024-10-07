import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent {
  @Input() currentPage!: number;
  @Input() totalPages!: number;
  @Output() pageChange = new EventEmitter<number>();
  maxPagesToShow = 4;

  get pagesToShow(): number[] {
    const startPage = Math.max(
      this.currentPage - Math.floor(this.maxPagesToShow / 2),
      1
    );
    const endPage = Math.min(
      startPage + this.maxPagesToShow - 1,
      this.totalPages
    );
    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageChange.emit(page);
  }
}
