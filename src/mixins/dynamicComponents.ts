import { Component, Vue } from 'vue-property-decorator';

@Component
class DynamicComponentMixin extends Vue {
    public activeComponentIndex = 0;
    private navigationHistory: number[] = [0];

    // Navigation property
    get navigationHistoryItemsCounts(): number {
        return this.navigationHistory.length;
    }

    get indexOfLastNavigationItem(): number {
        return this.navigationHistoryItemsCounts === 0 ? 0 : this.navigationHistoryItemsCounts - 1;
    }

    public handleNextSection(): void {
        this.activeComponentIndex += 1;
    }

    public handlePreviousSection(): void {
        if (this.activeComponentIndex === 0) return;
        this.activeComponentIndex -= 1;
    }

    public goBack(): void {
        if (this.navigationHistoryItemsCounts > 1) {
            this.navigationHistory.splice(this.indexOfLastNavigationItem, 1);

            // get the value of the last item in the array and set it as the active component index
            this.$nextTick(() => {
                this.activeComponentIndex = this.navigationHistory[this.indexOfLastNavigationItem];
            });
        }
    }

    public calculateProgressBar(numberOfStages: number): number {
        return (this.activeComponentIndex + 1) * (100 / numberOfStages);
    }

    public setActiveComponentIndex(componentIndex: number): void {
        this.activeComponentIndex = componentIndex;
        // update the array that keeps track of the navigation history
        this.navigationHistory.push(componentIndex);
    }
}

export default DynamicComponentMixin;
