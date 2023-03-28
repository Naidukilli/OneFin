import { Component, OnInit, TemplateRef } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';
import { MoviesService } from './movies.service';
import { MatDialog } from '@angular/material/dialog';

export interface Movie {
  description: string;
  genres: string;
  title: string;
  uuid: string;
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
})
export class MoviesComponent implements OnInit {
  searchTerm: string = '';
  movies: Movie[] = [];
  currentPage: number = 1;
  loading: boolean = true;
  itemsPerPage: number = 10;
  error: boolean = false;
  totalCount: number = 0;
  private searchSub!: Subscription;
  movie: Movie = {} as Movie;

  constructor(private movieService: MoviesService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  onSearch() {
    const searchBox: any = document.getElementById('search-box');
    const search$ = fromEvent(searchBox, 'keyup').pipe(
      debounceTime(250),
      distinctUntilChanged()
    );
    search$.subscribe(() => {
      if (this.searchTerm.length > 3) {
        this.fetchMovies();
      }
    });
    this.searchSub = search$.subscribe();
  }

  ngOnDestroy() {
    if (this.searchSub) {
      this.searchSub.unsubscribe();
    }
  }

  modalClose() {
    this.dialog.closeAll();
  }

  onPageChange() {
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.loading = true;
    this.error = false;
    this.movieService.getMovies(this.searchTerm, this.currentPage).subscribe(
      (response: any) => {
        this.totalCount = response.count;
        this.movies = response.results;
        this.loading = false;
      },
      () => {
        this.loading = false;
        this.error = true;
      }
    );
  }

  onRefresh(): void {
    this.fetchMovies();
  }

  //modal
  showModal(
    templateRef: TemplateRef<any>,
    modalData: Movie,
    event: MouseEvent
  ) {
    event.stopPropagation();
    this.movie = modalData;
    this.dialog.open(templateRef);
  }

  //pagination
  get totalPages(): number {
    return Math.ceil(this.totalCount / this.itemsPerPage);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const skipPages = 2;
    const startPage = Math.max(1, this.currentPage - skipPages);
    const endPage = Math.min(this.totalPages, this.currentPage + skipPages);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchMovies();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchMovies();
    }
  }

  nextPage(): void {
    console.log(this.totalPages, this.currentPage);

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchMovies();
    }
  }
}
