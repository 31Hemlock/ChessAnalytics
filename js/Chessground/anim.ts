import { Chessground }  from 'chessground';
import { Unit } from './unit';

export const conflictingAnim: Unit = {
  name: 'Animation: conflict',
  run(el) {
    const cg = Chessground(el, {
      animation: {
        duration: 500
      },
      fen: '8/8/5p2/4P3/4K3/8/8/8',
      turnColor: 'black',
      movable: {
        color: 'white',
        free: false
      }
    });
    setTimeout(() => {
      cg.move('f6', 'e5');
      cg.set({
        turnColor: 'white',
        movable: {
          dests: {e4: ['e5', 'd5', 'f5']}
        }
      });
      cg.playPremove();
    }, 2000);
    return cg;
  }
};
