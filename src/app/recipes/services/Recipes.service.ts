import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import {
  Category,
  CatergoriesResponse,
  Country,
  CountryResponse,
  Meal,
  MealResponse,
} from '../interfaces/recipes.interface';
import { BehaviorSubject, EMPTY, Observable, catchError, map, of } from 'rxjs';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private _recipes = new BehaviorSubject<Meal[]>([]); // Almacena todas las recetas
  public recipes$ = new BehaviorSubject<Meal[]>([]); // Observable para suscribirse a las recetas paginadas
  private newRecipeSubject = new BehaviorSubject<Meal | null>(null); // Emitir la receta nueva
  public newRecipe$ = this.newRecipeSubject.asObservable(); // Observable para la receta nueva
  private cacheCategories: Category[] = [];
  private cacheCountry: Country[] = [];

  private _currentPage = 1;
  private _pageSize = 10;
  private _totalPages = 0;
  private _totalProducts = 0;

  get pagedRecipes(): Meal[] {
    const startIndex = (this._currentPage - 1) * this._pageSize;
    const endIndex = startIndex + this._pageSize;
    return this._recipes.getValue().slice(startIndex, endIndex); // Obtener recetas paginadas
  }

  get currentPage() {
    return this._currentPage;
  }

  get pageSize() {
    return this._pageSize;
  }

  get totalPage() {
    return this._totalPages;
  }

  get totalProducts() {
    return this._totalProducts;
  }

  constructor(private http: HttpClient, private backendService: BackendService) {}

  // Métodos existentes para llamadas a TheMealDB
  getRecipeById(id: string): Observable<Meal | null> {
    return this.backendService.getRecipeById(id).pipe(
      map((recipe) => (recipe ? recipe : null)),
      catchError((error) => {
        console.error('Error al obtener la receta:', error);
        return of(null);
      })
    );
  }

  addRecipe(recipe: Meal): Observable<Meal> {
    return this.http.post<Meal>(`${environment.apiUrl}add.php`, recipe).pipe(
      map((response) => {
        this.addRecipeLocally(response);
        return response;
      }),
      catchError((error) => {
        console.error('Error al agregar la receta:', error);
        return EMPTY;
      })
    );
  }

  addRecipeLocally(recipe: Meal): void {
    const currentRecipes = this._recipes.getValue();
    this._recipes.next([recipe, ...currentRecipes]);
    this.newRecipeSubject.next(recipe); // Emitir la receta nueva a través de newRecipe$
    this.getDataPagination();
  }

  searchRecipesByDishName(name: string): void {
    this.http
      .get<MealResponse>(`${environment.apiUrl}search.php?s=${name}`)
      .pipe(
        catchError((error) => {
          console.error(error);
          return EMPTY;
        })
      )
      .subscribe({
        next: (value) => {
          this._recipes.next(value.meals ?? []);
          this.getDataPagination();
        },
      });
  }

  searchRecipesByCategories(category: string): void {
    this.http
      .get<MealResponse>(`${environment.apiUrl}filter.php?c=${category}`)
      .pipe(
        catchError((error) => {
          console.error(error);
          return EMPTY;
        })
      )
      .subscribe({
        next: (value) => {
          this._recipes.next(value.meals ?? []);
          this.getDataPagination();
        },
      });
  }

  searchRecipesByCountry(country: string): void {
    this.http
      .get<MealResponse>(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`)
      .pipe(
        catchError((error) => {
          console.error(error);
          return EMPTY;
        })
      )
      .subscribe({
        next: (value) => {
          this._recipes.next(value.meals ?? []);
          this.getDataPagination();
        },
      });
  }

  getCategories(): Observable<Category[]> {
    if (this.cacheCategories.length !== 0) {
      return of(this.cacheCategories);
    }
    return this.http
      .get<CatergoriesResponse>(`${environment.apiUrl}categories.php`)
      .pipe(
        map(({ categories }) => {
          this.cacheCategories = categories;
          return categories;
        })
      );
  }

  getCountries(): Observable<Country[]> {
    if (this.cacheCountry.length !== 0) {
      return of(this.cacheCountry);
    }
    return this.http
      .get<CountryResponse>('https://www.themealdb.com/api/json/v1/1/list.php?a=list')
      .pipe(
        map(({ meals: countries }) => {
          this.cacheCountry = countries;
          return countries;
        })
      );
  }

  getDataPagination() {
    this.calculateTotalPages();
    this.calculateTotalProducts();
    this.updatePagedRecipes();
  }

  calculateTotalPages() {
    this._totalPages = Math.ceil(this._recipes.getValue().length / this.pageSize);
  }

  calculateTotalProducts() {
    this._totalProducts = this._recipes.getValue().length;
  }

  onPageChange(page: number) {
    this._currentPage = page;
    this.updatePagedRecipes();
  }

  setPageSize(count: number) {
    this._pageSize = count;
    this.getDataPagination();
  }

  updatePagedRecipes() {
    this.recipes$.next(this.pagedRecipes); // Actualiza recipes$ solo con las recetas paginadas
  }

  saveRecipeFromApi(id: string): Observable<Meal> {
    return this.http.post<Meal>(`${environment.apiBackendUrl}/saveRecipeFromApi`, { id });
  }
}
