import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePictureServiceService {
  private profilePhotoSubject: BehaviorSubject<string> = new BehaviorSubject<string>('assets/images/defaultWorker.png');
  profilePhoto$ = this.profilePhotoSubject.asObservable();
  

  updateProfilePhoto(photoUrl: string): void {
    this.profilePhotoSubject.next(photoUrl);
  }
  updateProfilePhoto1(id:string,photoUrl: string): void {
    this.profilePhotoSubject.next(photoUrl);
  }
}
