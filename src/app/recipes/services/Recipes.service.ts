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
import {
  EMPTY,
  Observable,
  catchError,
  map,
  of,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipesService {
  private _pagedRecipes: Meal[] = [];
  private _recipes: Meal[] = [];
  private cacheCategories: Category[] = [];
  private cacheCountry: Country[] = [];
  
  private _currentPage = 1;
  private _pageSize = 10;
  private _totalPages = 0;
  private _totalProducts = 0;

  get recipes() {
    return [...this._recipes];
  }

  get pagedRecipes() {
    return [...this._pagedRecipes];
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

  constructor(private http: HttpClient) {}

  getRecipeById(id: string): Observable<Meal> {
    return this.http
      .get<MealResponse>(`${environment.apiUrl}lookup.php?i=${id}`)
      .pipe(map(({ meals: [recipe] }) => recipe));
  }

  addRecipe(recipe: Meal): Observable<Meal> {
    return this.http.post<Meal>(`${environment.apiUrl}add.php`, recipe).pipe(
      map(response => {
        this._recipes.push(response);
        this.getDataPagination();
        return response;
      }),
      catchError((error) => {
        console.error('Error al agregar la receta:', error);
        return EMPTY;
      })
    );
  }

  searchRecipesByDishName(name: string) {
    this.http
      .get<MealResponse>(`${environment.apiUrl}search.php?s=${name}`)
      .pipe(
        catchError((error) => {
          return EMPTY;
        })
      )
      .subscribe({
        next: (value) => {
          this._recipes = value.meals ?? [];
          this.getDataPagination();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  searchRecipesByCategories(category: string) {
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
          this._recipes = value.meals ?? [];
          this.getDataPagination();
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  searchRecipesByCountry(country: string) {
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
          this._recipes = value.meals ?? [];
          this.getDataPagination();
        },
        error: (err) => {
          console.error(err);
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
      .get<CountryResponse>(`${environment.apiUrl}list.php?a=list`)
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
    this.updatePagedProducts();
  }

  calculateTotalPages() {
    this._totalPages = Math.ceil(this._recipes.length / this.pageSize);
  }

  calculateTotalProducts() {
    this._totalProducts = this._recipes.length;
  }

  updatePagedProducts() {
    if (this._currentPage > this.totalPage) {
      this._currentPage = 1;
    }
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this._pagedRecipes = this._recipes.slice(startIndex, endIndex);
  }

  onPageChange(page: number) {
    this._currentPage = page;
    this.updatePagedProducts();
  }

  setPageSize(count: number) {
    this._pageSize = count;
    this.getDataPagination();
  }
}
