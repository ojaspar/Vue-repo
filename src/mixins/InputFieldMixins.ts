import { Component, Vue } from 'vue-property-decorator';

import { TargetObject } from '@/types';

@Component
class InputFieldMixins extends Vue {
    public handleFocus(event: TargetObject) {
        event.target.select();
    }

    public formHasError(errors: object): boolean {
        return Object.values(errors).some(value => value.length > 0);
    }
}

export default InputFieldMixins;
