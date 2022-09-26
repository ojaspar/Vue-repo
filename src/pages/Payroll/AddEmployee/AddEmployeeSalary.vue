<template>
    <b-container fluid class="add-employee-salary">
        <b-row>
            <b-col md="6" cols="12">
                <div class="add-employee-salary__large-plus-container">
                    <b-row>
                        <b-col>
                            <BaseSelectWithBorderAndFloatingLabel
                                textProperty="name"
                                keyProperty="name"
                                valueProperty="name"
                                defaultOptionText="-- Select Structure --"
                                floatingLabelText="Pay Structure"
                                :options="structure"
                                className="add-employee-salary-index__split-input"
                                v-model="form.paymentStructure"
                                :errors="addEmployeeSalaryError.payStructure"
                            />
                        </b-col>
                    </b-row>
                    <b-row v-if="form.paymentStructure !== 'Commission'">
                        <b-col>
                            <BaseSelectWithBorderAndFloatingLabel
                                textProperty="name"
                                keyProperty="name"
                                valueProperty="name"
                                defaultOptionText="-- Select Negotiation Pattern --"
                                floatingLabelText="Salary Negotiation Pattern"
                                :options="negotiationPattern"
                                className="add-employee-salary-index__split-input"
                                v-model="form.salaryNegotiationPattern"
                                @input="handleNegotiationPattern"
                                :errors="addEmployeeSalaryError.salaryNegotiationPattern"
                            />
                        </b-col>
                    </b-row>
                    <b-row v-if="form.paymentStructure !== 'Commission'">
                        <b-col>
                            <!-- -->
                            <BaseInputFieldWithBorderAndFloatingLabel
                                v-model="form.salary"
                                :floatingLabelText="wrapFloatingLabelTextWithCurrencySymbol('Salary', currency)"
                                className="add-employee-salary__split-input"
                                :errors="addEmployeeSalaryError.salary"
                                @input="formatAndValidateSalary"
                            />
                        </b-col>
                    </b-row>
                    <b-container
                        v-if="form.paymentStructure !== 'Commission'"
                        class="add-employee-salary__deduction-container"
                    >
                        <b-col class="add-employee-salary__deduction-container--header">
                            <p class="add-employee-salary__deduction-container--header--text">
                                {{ deductionLabel }}
                            </p>
                        </b-col>
                        <div class="add-employee-salary__deduction-container--content">
                            <b-row v-for="(item, index) in deductionAllowanceData" :key="index">
                                <b-col sm="6" cols="7" class="">
                                    <BaseCheckboxWithBorderAndFloatingLabel
                                        :labelText="item.name"
                                        inputContainerClass="add-employee-salary__checkbox-input"
                                        :overRideContainerClass="true"
                                        @change="handleCheckboxClick"
                                        @input="validateCheckboxText"
                                        :value="activateCheckbox[index]"
                                        :id="index"
                                    />
                                </b-col>
                                <b-col
                                    sm="6"
                                    cols="5"
                                    class="add-employee-salary__deduction-container--content--amount-layout"
                                >
                                    <span class="add-employee-salary__deduction-container--content--amount-layout--text"
                                        >₦</span
                                    ><span
                                        class="add-employee-salary__deduction-container--content--amount-layout--text add-employee-salary__wrap"
                                        >{{ item.amount | formatMoney }}</span
                                    >
                                </b-col>
                            </b-row>
                        </div>
                    </b-container>
                </div>
            </b-col>
            <b-col md="6" cols="12">
                <div class="add-employee-salary__large-plus-container">
                    <p class="add-employee-salary__text-bold text-left" v-if="form.paymentStructure !== 'Commission'">
                        Salary Breakdown
                    </p>
                    <b-container class="add-employee-salary__deduction-container">
                        <div class="p-2">
                            <p
                                class="add-employee-salary__text-bold text-center"
                                v-if="form.paymentStructure == 'Commission'"
                            >
                                Commission Only
                            </p>
                            <p
                                class="add-employee-salary__text mb-2 mt-2 text-center"
                                v-if="form.paymentStructure == 'Commission'"
                            >
                                Pay will be based on the company’s commission rate .
                            </p>
                        </div>
                        <div class="add-employee-salary__rule">
                            <div
                                v-if="form.paymentStructure !== 'Commission'"
                                class="add-employee-salary__deduction-container--content"
                            >
                                <b-row>
                                    <b-col sm="6" lg="7" cols="7">
                                        <p class="add-employee-salary__text text-left">
                                            {{ netAndGrossSalary.title }}
                                        </p>
                                    </b-col>
                                    <b-col
                                        sm="6"
                                        lg="5"
                                        cols="5"
                                        class="add-employee-salary__deduction-container--content--amount-layout"
                                    >
                                        <span class="total-variance__surplus" v-if="!netAndGrossSalary.amount">
                                            —
                                        </span>
                                        <div v-if="netAndGrossSalary.amount">
                                            <span
                                                class="add-employee-salary__deduction-container--content--amount-layout--text"
                                                >₦</span
                                            ><span
                                                class="add-employee-salary__deduction-container--content--amount-layout--text add-employee-salary__wrap"
                                                >{{ netAndGrossSalary.amount | formatMoney }}</span
                                            >
                                        </div>
                                    </b-col>
                                </b-row>
                                <div v-for="(item, index) in salaryBreakDown" :key="index">
                                    <b-row>
                                        <b-col class="" sm="6" lg="7" cols="7">
                                            <p class="add-employee-salary__text text-left">{{ item.name }}</p>
                                        </b-col>
                                        <b-col
                                            sm="6"
                                            cols="5"
                                            lg="5"
                                            class="add-employee-salary__deduction-container--content--amount-layout"
                                        >
                                            <span class="total-variance__surplus" v-if="!item.amount"> — </span>
                                            <div v-else>
                                                <span
                                                    class="add-employee-salary__deduction-container--content--amount-layout--text"
                                                    >₦</span
                                                ><span
                                                    class="add-employee-salary__deduction-container--content--amount-layout--text add-employee-salary__wrap"
                                                    >{{ item.amount | formatMoney }}</span
                                                >
                                            </div>
                                        </b-col>
                                    </b-row>
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="form.paymentStructure !== 'Commission'"
                            class="add-employee-salary__deduction-container--content"
                        >
                            <b-row
                                v-for="(singleGrossData, index) in grossDatas"
                                :key="index"
                                :class="{
                                    'add-employee-salary__deduction-container__gross--header-coloured':
                                        index + 1 === grossDatas.length,
                                }"
                            >
                                <b-col sm="6" cols="7" lg="7" class="">
                                    <p class="add-employee-salary__text-bold text-left">
                                        {{ singleGrossData.name }}
                                    </p>
                                </b-col>
                                <b-col
                                    sm="6"
                                    lg="5"
                                    cols="5"
                                    class="add-employee-salary__deduction-container--content--amount-layout"
                                >
                                    <span class="total-variance__surplus" v-if="!singleGrossData.amount"> — </span>
                                    <div v-else>
                                        <span
                                            class="add-employee-salary__deduction-container--content--amount-layout--text"
                                            >₦</span
                                        >
                                        <span
                                            class="add-employee-salary__deduction-container--content--amount-layout--text add-employee-salary__wrap"
                                            >{{ singleGrossData.amount | formatMoney }}
                                        </span>
                                    </div>
                                </b-col>
                            </b-row>
                        </div>
                    </b-container>

                    <b-container
                        v-if="form.paymentStructure !== 'Commission'"
                        class="add-employee-salary__deduction-footer"
                    >
                        <div class="d-flex">
                            <p>
                                <span class="add-employee-salary__deduction-footer__text">*Net Monthly Salary:</span>
                                Amount that will be paid to {{ employeeName }}. Take-Home Pay
                            </p>
                        </div>
                        <div class="d-flex">
                            <p>
                                <span class="add-employee-salary__deduction-footer__text">*Gross Annual Salary:</span>
                                Net Salary + Taxes
                            </p>
                        </div>
                    </b-container>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import CurrencyMixins from '@/mixins/currency';
import UtilityMixins from '@/mixins/Utility';
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator';
import { PaymentStructure, PayStructureAndSalaryNegotiation } from '@/pages/Payroll/AddEmployee/types';
import PayrollMixin from '@/pages/Payroll/payrollMixin';

@Component
export default class AddEmployeeSalary extends Mixins(CurrencyMixins, UtilityMixins, PayrollMixin) {
    @Prop({ required: true }) readonly deductionAllowanceData!: Array<PaymentStructure>;
    @Prop({ required: true }) readonly salaryBreakDown!: Array<PaymentStructure>;
    @Prop({ required: true }) readonly grossDatas!: Array<PaymentStructure>;
    @Prop({ required: true }) readonly structure!: Array<PayStructureAndSalaryNegotiation>;
    @Prop({ required: true }) readonly negotiationPattern!: Array<PayStructureAndSalaryNegotiation>;
    @Prop({ required: true }) readonly currency!: number;
    @Prop({ required: true }) readonly employeeName!: string;

    private deductionLabel = '';
    // 'Monthly Deductions & Allowances'

    private checkboxText = '';
    private form = {
        paymentStructure: '',
        salaryNegotiationPattern: '',
        salary: '',
    };
    private netAndGrossSalary = {
        title: 'Net Monthly Salary',
        amount: '',
    };
    private activateCheckbox = false;
    private checkboxClicked = false;
    private individualSalaryBreakDownIndex!: number;
    private total = 0;
    private calculationArray: Array<any> = [{}];
    private pattern!: string;

    private handleNegotiationPattern(value: string) {
        this.$nextTick(() => {
            this.validateNegotiationPattern(this.form.salaryNegotiationPattern);
            this.netAndGrossSalary.title = value;
            value === 'Gross Annual Salary'
                ? this.$emit('get-data-for-gross-data', 0)
                : this.$emit('get-data-for-gross-data', 1);
        });
    }

    private validateCheckboxText(value: string) {
        this.checkboxText = value;
    }

    private handleCheckboxClick(value: boolean) {
        this.$nextTick(() => {
            this.validateEmployeeSalaryForm(this.form);
            if (!this.employeeSalaryCalculation) return;
            const deductionIndex = this.deductionAllowanceData.findIndex(x => x.name === this.checkboxText);
            this.assignNetValues(value, deductionIndex);
        });
    }

    private assignNetValues(value: boolean, index: number) {
        this.$nextTick(() => {
            this.validateEmployeeSalaryForm(this.form);
            if (!this.employeeSalaryCalculation) return;
            if (value && this.checkboxText === this.deductionAllowanceData[index]['name']) {
                if (this.salaryBreakDown[index]['name'] === this.deductionAllowanceData[index]['name'])
                    this.salaryBreakDown[index]['amount'] = this.deductionAllowanceData[index]['amount'];
            } else {
                if (this.salaryBreakDown[index]['name'] === this.deductionAllowanceData[index]['name'])
                    this.salaryBreakDown[index]['amount'] = 0;
            }
        });
    }

    private formatAndValidateSalary(salary: string) {
        if (salary) {
            const inputedSalary = this.removeCommaFromString(salary);
            const employeesSalary = this.convertFormattedFiguresToNumber(salary);
            this.form.salary = this.convertFigureToCurrency(employeesSalary);
            this.$nextTick(() => {
                this.validateEmployeeSalary(salary);
                if (Number(inputedSalary)) this.netAndGrossSalary.amount = String(inputedSalary);
                this.$emit('calculate-percentage', this.form.salary);
            });
        } else this.netAndGrossSalary.amount = '';
    }

    @Watch('netAndGrossSalary.amount')
    handleAmount(value: string) {
        if (value) {
            if (this.pattern === 'Net Monthly Salary') {
                this.grossDatas[0].amount = this.removeCommaFromString(this.form.salary);
            }
            if (this.pattern === 'Gross Annual Salary') {
                const monthlySalary = this.removeCommaFromString(this.form.salary);
                this.grossDatas[1].amount = monthlySalary / 12;
                this.grossDatas[0].amount = this.removeCommaFromString(this.form.salary);
            }
        } else {
            this.grossDatas[0].amount = 0;
            this.grossDatas[1].amount = 0;
        }
    }
    @Watch('salaryBreakDown', { deep: true, immediate: true })
    calculateNetSalary(value: any) {
        this.$nextTick(() => {
            const breakdown = value;
            this.total = breakdown.reduce((a: any, b: any) => {
                return a + Number(b.amount);
            }, 0);
        });
    }

    @Watch('grossDatas', { deep: true, immediate: true })
    @Watch('total', { deep: true, immediate: true })
    calculateGrossAndNetValues() {
        if (this.pattern === 'Net Monthly Salary') {
            this.grossDatas[1].amount = this.calculateNetIncome();
            this.grossDatas[0].amount = this.calculateMothlyNetIncome();
        }
        if (this.pattern == 'Gross Annual Salary') {
            this.grossDatas[0].amount = this.calculateGrossAnnual();
            this.grossDatas[1].amount = this.calculateGrossMonthlyIncome();
        }
    }
    private calculateNetIncome(): number {
        const salary = this.removeCommaFromString(this.form.salary) * 12;
        return this.total * 12 + salary;
    }
    private calculateMothlyNetIncome(): number {
        const salary = this.removeCommaFromString(this.form.salary);
        return salary + this.total;
    }

    private calculateGrossMonthlyIncome(): number {
        const salary = this.removeCommaFromString(this.form.salary);
        const removeTotalFromSalary = salary - this.total;
        return removeTotalFromSalary / 12;
    }

    private calculateGrossAnnual(): number {
        return this.removeCommaFromString(this.form.salary) - this.total;
    }

    get salaryNegotiationPattern() {
        return this.form.salaryNegotiationPattern;
    }

    @Watch('salaryNegotiationPattern')
    handleSalaryNegotiation(value: string) {
        this.pattern = value;
    }
    @Watch('form.salaryNegotiationPattern')
    handleDeductionLabel(value: string) {
        this.$nextTick(() => {
            value === 'Net Monthly Salary'
                ? (this.deductionLabel = 'Monthly Deductions & Allowances')
                : (this.deductionLabel = 'Annual Deductions & Allowances');
            if (value && this.form.salary) this.$emit('calculate-percentage', this.form.salary);
        });
    }

    mounted() {
        this.form.paymentStructure = 'Salary';
        this.form.salaryNegotiationPattern = 'Net Monthly Salary';
    }
}
</script>
<style lang="scss">
@import 'src/styles/pages/payroll/add-employee-salary-form.scss';
</style>
