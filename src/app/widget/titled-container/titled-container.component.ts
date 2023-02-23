import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-titled-container',
  templateUrl: './titled-container.component.html',
  styleUrls: ['./titled-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitledContainerComponent {
  @Input() title: string | undefined;
}
