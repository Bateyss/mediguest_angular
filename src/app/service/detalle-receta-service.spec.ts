import { TestBed } from '@angular/core/testing';

import { DetalleRecetaService } from './detalle-receta-service';

describe('DetalleRecetaService', () => {
  let service: DetalleRecetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetalleRecetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
