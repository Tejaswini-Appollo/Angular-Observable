import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription, Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angularObservable';
  private firstObsSubscription!: Subscription;
  private firstSubjectSubscription!: Subscription;
  displayText = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    // this.firstObsSubscription = interval(1000).subscribe(
    //   (count) => console.log(count)
    // );

    // console.log(this.userService.activateEmitter); 

    this.firstSubjectSubscription = this.userService.activateEmitter.subscribe(disactivate => {
      this.displayText = disactivate;
    })

    const customObservable = new Observable((observer) => {
      let count = 1;
      setInterval(() => {
        observer.next(count);
        if(count == 5) {
          observer.complete();
        }
        if(count > 3) {
          observer.error(new Error('Count value is greater!'));
        }
        count++;
      }, 1000)
    });

    this.firstObsSubscription = customObservable.pipe(filter((data: any) => {
      return data > 1;
    }), map((data) => {
      return 'Round: ' + data;
    })).subscribe({
      next: (data) => console.log(data),
      error: (error) => {
        console.log(error);
        // alert(error); 
      },
      complete: () => console.log('Completed!')
    }
    );
  }

  ngOnDestroy(): void {
    this.firstObsSubscription.unsubscribe();
    this.firstSubjectSubscription.unsubscribe();
  }
}
