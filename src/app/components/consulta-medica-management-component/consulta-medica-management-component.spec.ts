import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaMedicaManagementComponent } from './consulta-medica-management-component';

describe('ConsultaMedicaManagementComponent', () => {
  let component: ConsultaMedicaManagementComponent;
  let fixture: ComponentFixture<ConsultaMedicaManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaMedicaManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConsultaMedicaManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
