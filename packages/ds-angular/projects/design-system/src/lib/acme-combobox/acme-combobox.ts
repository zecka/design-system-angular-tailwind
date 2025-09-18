import { BooleanInput } from '@angular/cdk/coercion';
import { booleanAttribute, Component, computed, Input, input, model, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

import {
  NgpCombobox,
  NgpComboboxButton,
  NgpComboboxDropdown,
  NgpComboboxInput,
  NgpComboboxOption,
  NgpComboboxPortal,
} from 'ng-primitives/combobox';
import { ChangeFn, provideValueAccessor, TouchedFn } from 'ng-primitives/utils';

@Component({
  selector: 'acme-combobox',
  templateUrl: './acme-combobox.html',
  styleUrl: './acme-combobox.css',
  providers: [provideValueAccessor(AcmeCombobox)],
  imports: [
    NgpCombobox,
    NgpComboboxDropdown,
    NgpComboboxOption,
    NgpComboboxInput,
    NgpComboboxPortal,
    NgpComboboxButton,
  ],
})
export class AcmeCombobox implements ControlValueAccessor {

  /** The options for the combobox. */
  readonly options = input<string[]>([]);

  readonly search = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });
  /** The selected value. */
  readonly value = model<string | undefined>();


  /** The placeholder for the input. */
  readonly placeholder = input<string>('');

  /** The disabled state of the combobox. */
  readonly disabled = input<boolean, BooleanInput>(false, {
    transform: booleanAttribute,
  });

  /** The filter value. */
  protected readonly filter = signal<string>('');

  /** Get the filtered options. */
  protected readonly filteredOptions = computed(() =>
    this.search() ? this.options().filter(option => option.toLowerCase().includes(this.filter().toLowerCase())) : this.options(),
  );

  /** Store the form disabled state */
  protected readonly formDisabled = signal(false);

  /** The on change callback */
  private onChange?: ChangeFn<string>;

  /** The on touch callback */
  protected onTouched?: TouchedFn;

  ngOnInit(): void {
    console.log('AcmeCombobox initialized', {
      search: this.search(),
      options: this.options(),
      placeholder: this.placeholder(),
      disabled: this.disabled(),
    });
  }

  onFilterChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filter.set(input.value);
  }

  writeValue(value: string | undefined): void {
    this.value.set(value);
    this.filter.set(value ?? '');
  }

  registerOnChange(fn: ChangeFn<string | undefined>): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: TouchedFn): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.formDisabled.set(isDisabled);
  }

  protected onValueChange(value: string): void {
    this.onChange?.(value);
    // update the filter value
    this.filter.set(value);
  }

  protected resetOnClose(open: boolean): void {
    // if the dropdown is closed, reset the filter value
    if (open) {
      return;
    }

    // if the filter value is empty, set the value to undefined
    if (this.filter() === '') {
      this.value.set(undefined);
    } else {
      // otherwise set the filter value to the selected value
      this.filter.set(this.value() ?? '');
    }
  }

}
