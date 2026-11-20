import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaManagementComponent } from './cita-management-component';

describe('CitaManagementComponent', () => {
  let component: CitaManagementComponent;
  let fixture: ComponentFixture<CitaManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitaManagementComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CitaManagementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
