import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnsplashService {

  constructor() { }

  public async getRandomImage(filter: String) {
    return await (await fetch("https://source.unsplash.com/1600x900/?" + filter)).url
  }
}
