import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmeCombobox } from './acme-combobox';

describe('AcmeCombobox', () => {
  let component: AcmeCombobox;
  let fixture: ComponentFixture<AcmeCombobox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcmeCombobox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcmeCombobox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
