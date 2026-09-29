import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

export type NoContentKind = 'error' | 'empty' | 'not-found';

/**
 * Animated, mobile-friendly "no content / error" state.
 * Shown whenever dynamic data could not be loaded or does not exist.
 * Pure CSS animations (no JS), respects reduced-motion preferences,
 * adapts to small screens and both colour themes.
 */
@Component({
  selector: 'app-no-content',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './no-content.component.html',
  styleUrls: ['./no-content.component.scss'],
})
export class NoContentComponent {
  /** error = load failed (retry offered) · empty = loaded but nothing to show · not-found = bad slug/id */
  readonly kind = input<NoContentKind>('error');
  readonly title = input<string>('');
  readonly message = input<string>('');
  readonly showRetry = input(true);
  readonly showHomeLink = input(true);
  readonly compact = input(false);

  readonly retry = output<void>();
  readonly retrying = input(false);

  handleRetry(): void {
    this.retry.emit();
  }
}
