import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class StorageService {

  constructor() { }

  addToStorage(valueName: string, value: string) {
    localStorage.setItem(valueName, value);
  }

  getFromStorage(value: string) {
    return localStorage.getItem(value);
  }

  removeFromStorage(item: any) {
    localStorage.removeItem(item);
  }
}
