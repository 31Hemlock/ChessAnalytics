import { Api } from 'chessground/api';

import * as play from './play'

export interface Unit {
  name: string;
  run: (el: HTMLElement) => Api
}

export const list: Unit[] = [
  play.initial, play.castling, play.vsRandom, play.fullRandom, play.slowAnim, play.conflictingHold,
];
