import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  public apiUrl = environment.serviceUrl + '/maya/movies/';

  constructor(private http: HttpClient) {}

  getMovies(searchTerm?: string, page?: number): Observable<any> {
    const params: { page: number; search?: string } = {
      page: page ? page : 1,
    };
    if (searchTerm) {
      params.search = searchTerm;
    }
    return this.http.get(this.apiUrl, { params });
  }
}
