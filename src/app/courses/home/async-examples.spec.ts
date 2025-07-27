import { fakeAsync, flush, flushMicrotasks, tick } from "@angular/core/testing";
import { of } from "rxjs";
import { delay } from "rxjs/operators";

describe('Async Testing Examples', () => {

  it('Asynchronous test example with Jasmine done()', (done: DoneFn) => {
    let flag = false;

    setTimeout(() => {
      console.log('running assertions');
      flag = true;
      expect(flag).toBeTruthy();
      done();
    }, 1000);
  });

  it('Asynchronous test example - setTimeout()', fakeAsync(() => {
    let flag = false;

    setTimeout(() => {
      console.log('running timeout');
    });

    setTimeout(() => {
      console.log('running assertions');
      flag = true;
      expect(flag).toBeTruthy();
    }, 1000);

    // tick(1000);
    flush();
    expect(flag).toBeTruthy();
  }));

  it('Asynchronous test example - plain Promise', fakeAsync(() => {
    let flag = false;
    console.log('Creating promise');

    setTimeout(() => {
      console.log('running timeout 1');
    });

    setTimeout(() => {
      console.log('running timeout 2');
    });

    setTimeout(() => {
      console.log('running timeout 3');
    });

    Promise.resolve().then(() => {
      console.log('Promise evaluated successfully 1');
      flag = true;
      return Promise.resolve();
    })
      .then(() => {
        console.log('Promise evaluated successfully 2');
      });

    // Promise and Timeouts are in different queues.
    flushMicrotasks();

    console.log('running assertions');
    expect(flag).toBeTruthy();
  }));

  it('Async test example = Promises + setTimeout()', fakeAsync(() => {
    let counter = 0;

    console.log('Creating promise');
    Promise.resolve().then(() => {
      console.log('Promise evaluated successfully 1');
      counter += 10;

      setTimeout(() => {
        console.log('running timeout');
        counter += 1;
      }, 1000);
      return Promise.resolve();
    });

    flushMicrotasks();
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(10);
    tick(500);
    expect(counter).toBe(11);
  }));

  it('Asynchronous test example - Observables', fakeAsync(() => {
    let flag = false;
    console.log('Creating observable');
    const flag$ = of(flag).pipe(delay(1000));

    flag$.subscribe(f => {
      console.log('Observable evaluated successfully');
      flag = true;
    });

    tick(1000);

    console.log('running assertions');
    expect(flag).toBeTruthy();
  }));

});
