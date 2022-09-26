import { Component, Mixins } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import { namespace } from 'vuex-class';

import ReportModule from '@/store/modules/report';

import {
    ReportItem,
    PeriodicRange,
    REPORT_LINE_ITEM,
    REPORT_CATEGORY,
    ReportLineItemComputableFields,
} from '@/pages/Reports/types';
import { ReportsRequestStatus, VueExtension } from '@/types';

import CurrencyMixins from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';

const report = namespace('report');
let reportModule: ReportModule;

@Component
class ReportsMixin extends Mixins(CurrencyMixins, UtilityMixins) {
    public specifiedPeriod = 'This Month';

    public periodicRange: PeriodicRange[] = [];

    $root!: VueExtension;

    @report.State
    public reportsRequest!: ReportsRequestStatus;

    @report.State
    public balanceSheetReport!: ReportItem[];

    @report.Action
    public getBalancesheetReport!: () => ReportItem[];

    get reportsModule() {
        return reportModule;
    }

    get currentAssets(): ReportItem[] {
        return this.filterItemsByReportCategory(this.balanceSheetReport, REPORT_CATEGORY.CURRENT_ASSETS);
    }

    get liabilities(): ReportItem[] {
        return this.filterItemsByReportCategory(this.balanceSheetReport, REPORT_CATEGORY.TOTAL_LIABILITIES);
    }

    get funding(): ReportItem[] {
        const retainedProfitOrLoss: ReportItem = {
            reportLine: this.currentNetProfitOrLoss < 0 ? 'Retained Loss' : 'Retained Profit',
            currentAmount: this.currentNetProfitOrLoss,
            previousAmount: 0,
            reportCategory: 'Net Assets',
            reportCategoryKey: REPORT_CATEGORY.NET_ASSETS,
            reportLineKey: '',
        };

        const fundingItems = this.filterItemsByReportCategory(this.balanceSheetReport, REPORT_CATEGORY.NET_ASSETS);

        fundingItems.push(retainedProfitOrLoss);

        return fundingItems;
    }

    get nonCurrentAssets(): Array<ReportItem> {
        return this.filterItemsByReportCategory(this.balanceSheetReport, REPORT_CATEGORY.NON_CURRENT_ASSETS);
    }

    get nonCurrentAssetsPpe(): Array<ReportItem> {
        return this.nonCurrentAssets.filter(
            (reportItem: ReportItem) =>
                reportItem.reportLineKey === REPORT_LINE_ITEM.PPE ||
                reportItem.reportLineKey === REPORT_LINE_ITEM.PPE_DEPRECIATION,
        );
    }

    get otherNonCurrentAssets(): Array<ReportItem> {
        return this.nonCurrentAssets.filter(
            (reportItem: ReportItem) =>
                reportItem.reportLineKey !== REPORT_LINE_ITEM.PPE &&
                reportItem.reportLineKey !== REPORT_LINE_ITEM.PPE_DEPRECIATION,
        );
    }

    get previousNetValueOfPpe(): number {
        const totalPpe = this.calculateTotal(this.nonCurrentAssetsPpe, 'previousAmount');

        return totalPpe;
    }

    get currentNetValueOfPpe(): number {
        const totalPpe = this.calculateTotal(this.nonCurrentAssetsPpe, 'currentAmount');

        return totalPpe;
    }

    get previousTotalNonCurrentAssets(): number {
        const previousTotalNonCurrentAssets = this.calculateTotal(this.nonCurrentAssets, 'previousAmount');

        return previousTotalNonCurrentAssets;
    }

    get currentTotalNonCurrentAssets(): number {
        const currentTotalNonCurrentAssets = this.calculateTotal(this.nonCurrentAssets, 'currentAmount');

        return currentTotalNonCurrentAssets;
    }

    get previousTotalCurrentAssets(): number {
        const previousTotalCurrentAssets = this.calculateTotal(this.currentAssets, 'previousAmount');

        return previousTotalCurrentAssets;
    }

    get currentTotalCurrentAssets(): number {
        const currentTotalCurrentAssets = this.calculateTotal(this.currentAssets, 'currentAmount');

        return currentTotalCurrentAssets;
    }

    get previousTotalAssets(): number {
        const previousTotalAssets = this.previousTotalCurrentAssets + this.previousTotalNonCurrentAssets;

        return previousTotalAssets;
    }

    get currentTotalAssets(): number {
        const currentTotalAssets = this.currentTotalCurrentAssets + this.currentTotalNonCurrentAssets;

        return currentTotalAssets;
    }

    get previousTotalLiabilities(): number {
        const previousTotalLiabilities = this.calculateTotal(this.liabilities, 'previousAmount');

        return previousTotalLiabilities;
    }

    get currentTotalLiabilities(): number {
        const currentTotalLiabilities = this.calculateTotal(this.liabilities, 'currentAmount');

        return currentTotalLiabilities;
    }

    get previousNetAssets(): number {
        const previousNetAssets = this.previousTotalAssets - this.previousTotalLiabilities;

        return previousNetAssets;
    }

    get currentNetAssets(): number {
        const currentNetAssets = this.currentTotalAssets - this.currentTotalLiabilities;

        return currentNetAssets;
    }

    get previousShareholdersFund(): number {
        const previousShareholdersFund = this.calculateTotal(this.funding, 'previousAmount');

        return previousShareholdersFund;
    }

    get currentShareholdersFund(): number {
        const currentShareholdersFund = this.calculateTotal(this.funding, 'currentAmount');

        return currentShareholdersFund;
    }

    get expenseItems(): ReportItem[] {
        return this.balanceSheetReport.filter(
            (reportLineItem: ReportItem) => reportLineItem.reportCategoryKey === REPORT_CATEGORY.EXPENSES,
        );
    }

    get previousTotalExpense(): number {
        const previousTotalExpense = this.calculateTotal(this.expenseItems, 'previousAmount');

        return previousTotalExpense;
    }

    get currentTotalExpense(): number {
        const currentTotalExpense = this.calculateTotal(this.expenseItems, 'currentAmount');

        return currentTotalExpense;
    }

    get incomeItems(): ReportItem[] {
        return this.filterItemsByReportCategory(this.balanceSheetReport, REPORT_CATEGORY.INCOME);
    }

    get incomeItemsWithoutTotalIncomeAndCostOfItemsSold(): Array<ReportItem> {
        return this.incomeItems.filter(
            (item: ReportItem) => item.reportLineKey !== REPORT_LINE_ITEM.COST_OF_ITEMS_SOLD,
        );
    }

    get previousTotalIncome(): number {
        // const incomeItems = this.incomeItems.filter(
        //     (item: ReportItem) => item.reportLineKey !== REPORT_LINE_ITEM.COST_OF_ITEMS_SOLD,
        // );
        // const previousTotalIncome = this.calculateTotal(incomeItems, 'previousAmount');
        const previousTotalIncome = this.calculateTotal(this.incomeItems, 'previousAmount');

        return previousTotalIncome;
    }

    get currentTotalIncome(): number {
        // const incomeItems = this.incomeItems.filter(
        //     (item: ReportItem) => item.reportLineKey !== REPORT_LINE_ITEM.COST_OF_ITEMS_SOLD,
        // );
        // const currentTotalIncome = this.calculateTotal(incomeItems, 'currentAmount');
        const currentTotalIncome = this.calculateTotal(this.incomeItems, 'currentAmount');

        return currentTotalIncome;
    }

    get costOfItemSold(): Array<ReportItem> {
        return this.filterItemsByReportCategory(this.balanceSheetReport, REPORT_CATEGORY.COST_OF_ITEMS_CONSUMED);

        // return this.incomeItems.filter(
        //     (item: ReportItem) => item.reportLineKey === REPORT_LINE_ITEM.COST_OF_ITEMS_SOLD,
        // );
    }

    get costOfItemSoldWithLess(): Array<ReportItem> {
        return this.costOfItemSold.map(item => {
            return {
                ...item,
                reportLine: 'Less ' + item.reportLine,
            };
        });
    }

    get costOfMaterials(): Array<ReportItem> {
        return this.costOfItemSold.map(item => {
            return {
                ...item,
                reportLine:
                    item.reportLine == 'Cost of Items Sold/Consumed'
                        ? 'Cost of Materials/Consumables'
                        : item.reportLine,
            };
        });
    }

    get previousTotalCostOfItemSold(): number {
        const previousTotalIncome = this.calculateTotal(this.costOfItemSold, 'previousAmount');

        return previousTotalIncome;
    }

    get currentTotalCostOfItemSold(): number {
        const currentTotalIncome = this.calculateTotal(this.costOfItemSold, 'currentAmount');

        return currentTotalIncome;
    }

    get previousTotalExpenseAndCostOfItemsSold(): number {
        return this.previousTotalExpense + this.previousTotalCostOfItemSold;
    }

    get currentTotalExpenseAndCostOfItemsSold(): number {
        return this.currentTotalExpense + this.currentTotalCostOfItemSold;
    }

    get previousGrossProfit(): number {
        // const costOfItemsSoldLineItem = this.incomeItems.find(
        //     (item: ReportItem) => item.reportLineKey === REPORT_LINE_ITEM.COST_OF_ITEMS_SOLD,
        // );

        // const costOfItemsSold = costOfItemsSoldLineItem?.previousAmount || 0;
        // const previousGrossProfit = this.previousTotalIncome - costOfItemsSold;
        const previousGrossProfit = this.previousTotalIncome - this.previousTotalCostOfItemSold;

        return previousGrossProfit;
    }

    get currentGrossProfit(): number {
        // const costOfItemsSoldLineItem = this.incomeItems.find(
        //     (item: ReportItem) => item.reportLineKey === REPORT_LINE_ITEM.COST_OF_ITEMS_SOLD,
        // );

        // const costOfItemsSold = costOfItemsSoldLineItem?.currentAmount || 0;
        // const currentGrossProfit = this.currentTotalIncome - costOfItemsSold;
        const currentGrossProfit = this.currentTotalIncome - this.currentTotalCostOfItemSold;

        return currentGrossProfit;
    }

    get previousNetProfitOrLoss(): number {
        const previousNetProfitOrLoss = this.previousGrossProfit - this.previousTotalExpense;

        return previousNetProfitOrLoss;
    }

    get currentNetProfitOrLoss(): number {
        const currentNetProfitOrLoss = this.currentGrossProfit - this.currentTotalExpense;

        return currentNetProfitOrLoss;
    }

    public filterItemsByReportCategory(reportLineItems: Array<ReportItem>, reportCategoryKey: REPORT_CATEGORY) {
        return reportLineItems.filter(
            (reportLineItem: ReportItem) => reportLineItem.reportCategoryKey === reportCategoryKey,
        );
    }

    public calculateTotal(arrayOfItems: ReportItem[], field: keyof ReportLineItemComputableFields): number {
        return arrayOfItems.reduce((totalAmount: number, nextItem: ReportItem) => totalAmount + nextItem[field], 0);
    }

    async created() {
        reportModule = getModule(ReportModule, this.$store);
        await reportModule.getBalancesheetReport(this.specifiedPeriod);
    }
}

export default ReportsMixin;
