import { CalculatorService } from "./calculator.service";
import { LoggerService } from "./logger.service";
import { TestBed } from "@angular/core/testing";
import createSpyObj = jasmine.createSpyObj;

describe('CalculatorService', () => {

  let calculator: CalculatorService;
  let loggerSpy: any;

  beforeAll(() => {
    loggerSpy = createSpyObj('LoggerService', ['log']);
    TestBed.configureTestingModule({
      providers: [
        CalculatorService,
        {
          provide: LoggerService, useValue: loggerSpy
        }
      ]
    });
  });

  beforeEach(() => {
    calculator = TestBed.inject(CalculatorService);
  });

  it('should add two numbers', () => {
    const result = calculator.add(2, 2);

    expect(result)
      .toBe(4);
    expect(loggerSpy.log)
      .toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    const result = calculator.subtract(2, 2);

    expect(result)
      .withContext("unexpected subtraction result")
      .toBe(0);
  });

});
