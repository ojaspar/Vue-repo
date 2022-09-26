import Vue from 'vue';

Vue.directive('floating-number-only', {
    bind(el) {
        el.addEventListener('keydown', e => {
            if (
                [
                    'Digit0',
                    'Digit1',
                    'Digit2',
                    'Digit3',
                    'Digit4',
                    'Digit5',
                    'Digit6',
                    'Digit7',
                    'Digit8',
                    'Digit9',
                    'Escape',
                    'Backspace',
                    'Enter',
                    'Period',
                    'DecimalPoint',
                    'Delete',
                    'Home',
                    'End',
                    'ArrowRight',
                    'ArrowLeft',
                ].indexOf(e.code) !== -1 ||
                // Allow: Ctrl+A
                (e.code === 'KeyA' && e.ctrlKey === true) ||
                // Allow: Ctrl+C
                (e.code === 'KeyC' && e.ctrlKey === true) ||
                // Allow: Ctrl+X
                (e.code === 'KeyX' && e.ctrlKey === true)
            ) {
                // let it happen, don't do anything
                if (e.code === 'Period' || e.code === 'DecimalPoint') {
                    // we want to check the number of periods we have
                    // if it is greater than 1 - preventdefault
                    const stringInput = e.target.value.toString();
                    const dotExistsAlready = [...stringInput].includes('.');
                    if (dotExistsAlready) {
                        e.preventDefault();
                        return;
                    }
                }
                return;
            }
            e.preventDefault();
        });
    },
});
