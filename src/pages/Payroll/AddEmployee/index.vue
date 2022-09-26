<template>
    <b-container fluid class="p-0 add-employee-page">
        <ProgressTracker
            v-if="!$root.isMobileScreenSize"
            :activeComponentIndex="activeComponentIndex"
            :progress="calculateProgressBar(3)"
            :showLoginLayout="showLoginLayout"
        />
        <b-row class="add-employee-page__content">
            <keep-alive>
                <transition name="fade" mode="out-in">
                    <component
                        :key="activeComponentIndex"
                        :is="componentList[activeComponentIndex]"
                        :activeComponentIndex="activeComponentIndex"
                        :fileUploadText="fileUploadText"
                        @bio-data-entered="handleBioDataEntry"
                        @guarantor-data-entered="handleGuarantorData"
                        @back-to-add-employee-page="backToEmployeePage"
                        @back-to-guarantor-page="backToGuarantorPage"
                        @get-data-for-gross-data="getDataForGross"
                        @calculate-percentage="calculateEmployeePercentage"
                        @fileName="getFileName"
                        :deductionAllowanceData="deductionAllowanceData"
                        :grossDatas="grossDatas"
                        :bioData="bioData"
                        :guarantorData="guarantorData"
                        :stateOfResidence="states"
                        :negotiationPattern="negotiationPattern"
                        :structure="structure"
                        :currency="currency"
                        :salaryBreakDown="salaryBreakDown"
                        :employeeName="bioData.firstName"
                    />
                </transition>
            </keep-alive>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator';

import { namespace } from 'vuex-class';
import { getModule } from 'vuex-module-decorators';

import PayrollModule from '@/store/modules/payroll';
import { CountryState, LeftIcon } from '@/types';

import AddEmployeeForm from '@/pages/Payroll/AddEmployee/AddEmployeeForm.vue';
import GuarantorInformationForm from '@/pages/Payroll/AddEmployee/GuarantorInformationForm.vue';
import DynamicComponentMixin from '@/mixins/dynamicComponents.ts';
import AddEmployeeSalaryForm from '@/pages/Payroll/AddEmployee/AddEmployeeSalary.vue';

import {
    EmployeeBioData,
    defaultEmployeeBioData,
    GuarantorData,
    defaultGuarantorData,
    PayStructureAndSalaryNegotiation,
    EmployeeSalary,
    defaultEmployeeSalary,
    PaymentStructure,
    PaymentTypes,
    TaxTypes,
} from '@/pages/Payroll/AddEmployee/types';
import UtilityMixins from '@/mixins/Utility';
import PayrollMixin from '@/pages/Payroll/payrollMixin';

const payroll = namespace('payroll');
let payrollModule: PayrollModule;

@Component({ components: { AddEmployeeForm, GuarantorInformationForm, AddEmployeeSalaryForm } })
export default class AddEmployeeIndex extends Mixins(DynamicComponentMixin, UtilityMixins, PayrollMixin) {
    private showLoginLayout = true;
    private componentList: object[] = [AddEmployeeForm, GuarantorInformationForm, AddEmployeeSalaryForm];
    private fileUploadText = 'Upload Guarantor Document';
    private employeeSalaryStructure: EmployeeSalary = { ...defaultEmployeeSalary };
    private deductionAllowanceData: Array<PaymentStructure> = [
        {
            name: 'Income Tax (PAYE)',
            amount: 0,
        },
        {
            name: 'Pension',
            amount: 0,
        },
    ];

    private grossSalary: Array<PaymentStructure> = [
        {
            name: `Gross Monthly Salary`,
            amount: 0,
        },
        {
            name: `Gross Annual Salary`,
            amount: 0,
        },
    ];

    private netSalary: Array<PaymentStructure> = [
        {
            name: `Net Annual Salary`,
            amount: 0,
        },
        {
            name: `Net Monthly Salary`,
            amount: 0,
        },
    ];

    private grossDatas: Array<PaymentStructure> = this.grossSalary;

    private salaryBreakDown: Array<PaymentStructure> = [
        {
            name: 'Income Tax (PAYE)',
            amount: 0,
        },
        {
            name: 'Pension',
            amount: 0,
        },
    ];
    private structure: Array<PayStructureAndSalaryNegotiation> = [
        {
            name: `Salary`,
            id: 1,
        },
        {
            name: `Commission`,
            id: 2,
        },
        {
            name: `Salary and Commission`,
            id: 3,
        },
    ];
    private negotiationPattern: Array<PayStructureAndSalaryNegotiation> = [
        {
            name: `Net Monthly Salary`,
            id: 1,
        },
        {
            name: `Gross Annual Salary`,
            id: 2,
        },
    ];
    private currency = 566;
    private paymentType = PaymentTypes.SALARY;

    private pageTitle = `Add Employee - `;
    private leftIcon = LeftIcon.None;
    getFileName(fileName: string) {
        this.fileUploadText = fileName;
    }
    public bioData: EmployeeBioData = { ...defaultEmployeeBioData };
    public guarantorData: GuarantorData = { ...defaultGuarantorData };

    private handleBioDataEntry(bioData: EmployeeBioData) {
        this.bioData = bioData;
        this.setActiveComponentIndex(1);
    }
    private handleGuarantorData(guarantorData: GuarantorData) {
        this.guarantorData = guarantorData;
        this.setActiveComponentIndex(2);
    }
    private backToEmployeePage(bioDataIndeex: number) {
        this.$emit('employee-bio-data', this.bioData);
        this.setActiveComponentIndex(bioDataIndeex);
    }
    private backToGuarantorPage(guarantorIndex: number) {
        this.$emit('guarantor-data', this.guarantorData);
        this.setActiveComponentIndex(guarantorIndex);
    }

    private getDataForGross(value: number) {
        value === 1 ? (this.grossDatas = this.grossSalary) : (this.grossDatas = this.netSalary);
    }

    private async calculateEmployeePercentage(value: string) {
        const getNumberFromString = this.removeCommaFromString(value);
        await this.calculateTaxAmountToBePaid(this.paymentType, getNumberFromString);
        await this.calculatePensionAmountToBePaid(this.paymentType, getNumberFromString);
    }

    private percentageCalculate(amount: number, per: number): number {
        return (amount / 100) * per;
    }

    @payroll.State
    public states!: Array<CountryState>;

    @payroll.State
    private taxAmount!: number;

    @payroll.State
    private pensionAmount!: number;

    @payroll.Action
    public getStates!: () => Array<CountryState>;

    @Watch('activeComponentIndex')
    activeIndexChange(newValue: number) {
        this.$nextTick(() => {
            switch (newValue) {
                case 0:
                    this.emitMobilePageTitle('Add Employee - Biodata');
                    break;
                case 1:
                    this.emitMobilePageTitle('Add Employee - Guarantor Info');
                    break;
                case 2:
                    this.emitMobilePageTitle('Add Employee - Guarantor Info');
                    this.pageTitle = `Add Employee - Guarantor Info`;
                    break;
            }
        });
    }

    @Watch('taxAmount')
    getTaxAMount(tax: number) {
        this.deductionAllowanceData[0].amount = tax;
    }

    @Watch('pensionAmount')
    getPensionAmount(pension: number) {
        this.deductionAllowanceData[1].amount = pension;
    }

    private async calculateTaxAmountToBePaid(paymentType: string, amount: number): Promise<void> {
        const taxType = paymentType === PaymentTypes.SALARY ? TaxTypes.PAYE : TaxTypes.WITHOLDING;
        await payrollModule.calculateTaxAmountForPayment({
            paymentAmount: amount,
            taxType,
        });
    }

    private async calculatePensionAmountToBePaid(paymentType: string, amount: number): Promise<void> {
        const taxType = paymentType === PaymentTypes.SALARY ? TaxTypes.PAYE : TaxTypes.WITHOLDING;
        await payrollModule.calculatePensionAmountForPayment({
            paymentAmount: amount,
            taxType,
        });
    }

    private emitMobilePageTitle(pageTitle: string) {
        this.$parent.$emit('update-page-title', pageTitle);
    }

    created() {
        payrollModule = getModule(PayrollModule, this.$store);
        Promise.all([payrollModule.getStates()]);
    }
    mounted() {
        this.emitMobilePageTitle('Add Employee - Biodata');
    }
}
</script>

<style lang="scss">
@import 'src/styles/pages/financing/loan/add-loan-index';
</style>
