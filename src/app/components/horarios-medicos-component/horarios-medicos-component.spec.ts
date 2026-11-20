import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorariosMedicosComponent } from './horarios-medicos-component';

describe('HorariosMedicosComponent', () => {
  let component: HorariosMedicosComponent;
  let fixture: ComponentFixture<HorariosMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorariosMedicosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HorariosMedicosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
