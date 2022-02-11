import { Injectable } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { UserPhoto } from '../models/UserPhoto';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private PHOTO_STORAGE: string = 'photos';
  constructor() {
  }

  public storePhotos(photos: UserPhoto[]) {
    console.log("Storing the following", photos);
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(photos)
    })
  }

  public async loadPhotos() {
    const photoList = await Storage.get({ key: this.PHOTO_STORAGE });
    const photos = JSON.parse(photoList.value) || [];
    console.log("Loaded photos from storage", photos);

    for (let photo of photos) {
      const path = photo.filePath;
      if (!path) continue;
      this.isUrl(path) ? photo.data = path : photo.data = await this.readFileData(photo.filepath);
    }
    return photos;
  }

  private isUrl(path: string) {
    return path.startsWith("http");
  }

  private async readFileData(path: string) {
    const readFile = await Filesystem.readFile({
      path: path,
      directory: Directory.Data,
    });
    return readFile.data;
  }

  public async clearPhotos() {
    await Storage.clear();
  }
}
