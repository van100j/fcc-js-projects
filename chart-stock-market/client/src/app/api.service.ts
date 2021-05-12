import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { environment as env } from '../environments/environment';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ApiService {
  stocks: any[];
  stocksChanged = new Subject<any>();

  constructor(private http: Http) { }

  getStocks() {
    return this.http.get(`${env.apiRootUrl}/stocks`)
      .toPromise()
      .then((response: Response) => {
        this.stocks = response.json().data;
        this.stocksChanged.next(this.stocks);
      })
      .catch(this.handleError);
  }

  getStock(symbol: string) {
    return this.http.get(`${env.apiRootUrl}/stocks/${symbol}`)
      .toPromise()
      .then((response: Response) => {
        const stock = response.json().data;
        this.stocks = [stock, ...this.stocks];
        this.stocksChanged.next(this.stocks);
      })
      .catch(this.handleError);
  }

  addStock(symbol: string) {
    return this.http.post(`${env.apiRootUrl}/stocks`, {symbol: symbol})
      .toPromise()
      .then((response: Response) => response.json())
      .catch(this.handleError);
  }

  removeStock(symbol: string) {
    return this.http.delete(`${env.apiRootUrl}/stocks/${symbol}`)
      .toPromise()
      .then((response: Response) => response.json())
      .catch(this.handleError);
  }

  remove(symbol: string) {
    this.stocks = this.stocks.filter(s => s.dataset_code !== symbol);
    this.stocksChanged.next(this.stocks);
  }

  private handleError(err: any): Promise<any> {
    if(err instanceof Response) {
      const { error } = err.json();
      return Promise.reject(error.message || error);
    }
    return Promise.reject(err.message || err);
  }
}
