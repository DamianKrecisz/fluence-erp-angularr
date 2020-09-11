import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentOrdersTableComponent } from './orders-table.component';

describe('RecentActionsTableComponent', () => {
  let component: RecentOrdersTableComponent;
  let fixture: ComponentFixture<RecentOrdersTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecentOrdersTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecentOrdersTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
