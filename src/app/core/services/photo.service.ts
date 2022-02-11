import { Injectable, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Storage } from '@capacitor/storage';
import { UnsplashService } from 'src/app/features/overview/services/unsplash.service';
import { UserPhoto } from '../models/UserPhoto';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PhotoService implements OnInit{
  private static photos: UserPhoto[] = [];

  public get photos() {
    return PhotoService.photos;
  }

  constructor(private storageService: StorageService) { 
    this.storageService.loadPhotos().then(photos => PhotoService.photos = photos);
  }
  
  async ngOnInit() {
  }
  
  public async clearGallery() {
    PhotoService.photos = [];
    await this.storageService.clearPhotos();
  }

  public async capturePhoto() {
    // Take a photo
    let capturedPhoto = null;
    try {
      capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt,
        quality: 85
      });
    }
    catch(error) {
      console.log(error);
      throw(error);
    }

    const base64Data = this.readPhotoAsBase64(capturedPhoto);
    const savedImageFile = await this.savePictureData(base64Data);
    await this.addPhotoToGallery(savedImageFile)
    return savedImageFile;
  }

  public async addPhotoToGallery(photo: UserPhoto) {
    PhotoService.photos.unshift(photo);
    this.storageService.storePhotos(PhotoService.photos);
  }

  private readPhotoAsBase64(photo: Photo) {
    return "data:image/png;base64," + photo.base64String;
  }

  public async savePictureData(data: string) {
    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: data,
      directory: Directory.Data
    });
  
    return {
      filepath: fileName,
      data: data
    } as UserPhoto;
  }
}
