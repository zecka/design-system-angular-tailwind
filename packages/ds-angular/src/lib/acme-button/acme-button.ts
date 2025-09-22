import { Component } from '@angular/core';
import vars from '@acme/ds-tokens/functional-default'
import { input, computed } from '@angular/core';

import { btn, BtnVariants } from '../../../../ds-css/src/components/btn.cva'

@Component({
  selector: 'acme-button',
  imports: [],
  templateUrl: './acme-button.html',
  styleUrl: './acme-button.css'
})
export class AcmeButton {
  size = input<BtnVariants['size']>();
  intent = input<BtnVariants['intent']>();
  cvaClasses = computed(() => btn({ size: this.size(), intent: this.intent() }));
  ngOnInit() {
    console.log('vars', vars);
  }
}
