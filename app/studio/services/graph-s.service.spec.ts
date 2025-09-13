import { TestBed } from '@angular/core/testing';

import { GraphSService } from './graph-s.service';

describe('GraphSService', () => {
  let service: GraphSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
