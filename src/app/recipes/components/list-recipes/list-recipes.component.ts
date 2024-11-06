import { Component, HostListener, OnInit } from '@angular/core';
import { RecipesService } from '../../services/Recipes.service';
import { Meal } from '../../interfaces/recipes.interface';

@Component({
  selector: 'app-list-recipes',
  templateUrl: './list-recipes.component.html',
  styleUrls: ['./list-recipes.component.css'],
})
export class ListRecipesComponent implements OnInit {
  recipes: Meal[] = [];
  currentPage: number = 1;  // Definimos currentPage con valor inicial
  totalPages: number = 0;   // Definimos totalPages con valor inicial

  // Definir pageSizeOptions con el tipo correcto
  pageSizeOptions: { width: number; pageSize: number }[] = [
    { width: 1100, pageSize: 10 },
    { width: 864, pageSize: 8 },
    { width: 564, pageSize: 6 },
    { width: 0, pageSize: 3 },
  ];

  constructor(private serviceRecipes: RecipesService) {
    this.setPageSize();
  }

  ngOnInit(): void {
    this.serviceRecipes.recipes$.subscribe((recipes) => {
      this.recipes = recipes;
      this.updatePagination(); // Actualizar la paginación cuando cambien las recetas
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.serviceRecipes.onPageChange(page);
    this.updatePagination(); // Asegura que se actualicen las páginas
  }

  updatePagination() {
    this.totalPages = this.serviceRecipes.totalPage;
    this.currentPage = this.serviceRecipes.currentPage;
  }

  @HostListener('window:resize', ['$event'])
  setPageSize() {
    const width = window.innerWidth;
    const pageSize =
      this.pageSizeOptions.find((option: { width: number; pageSize: number }) => width >= option.width)?.pageSize || 3;
    this.serviceRecipes.setPageSize(pageSize);
    this.updatePagination(); // Actualizar paginación tras cambiar el tamaño de página
  }

  trackCardById(index: number, card: any): number {
    return index; // Suponiendo que tus cards tienen una propiedad "id" única
  }
}