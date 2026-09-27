<script setup>
import { computed } from 'vue'
import { planTotalSpend, planBudgetWarning } from '../../services/selectors'
import { formatMoney } from '../../utils/format'

const props = defineProps({
  plan: { type: Object, required: true },
})

const level = computed(() => planBudgetWarning(props.plan))
const spend = computed(() => planTotalSpend(props.plan))
const budget = computed(() => Number(props.plan.budget) || 0)
const percent = computed(() => (budget.value > 0 ? Math.round((spend.value / budget.value) * 100) : 0))
const overAmount = computed(() => spend.value - budget.value)
</script>

<template>
  <div v-if="level" class="budget-alert" :class="level" role="alert">
    <span class="alert-icon">{{ level === 'danger' ? '⛔' : '⚠️' }}</span>
    <span v-if="level === 'warning'">
      预算预警：累计花费 {{ formatMoney(spend) }}，已达预算 {{ formatMoney(budget) }} 的
      {{ percent }}%，请注意控制开销
    </span>
    <span v-else>
      预算超支：累计花费 {{ formatMoney(spend) }}，已达预算 {{ formatMoney(budget) }} 的
      {{ percent }}%<template v-if="overAmount > 0">，超出 {{ formatMoney(overAmount) }}</template>
    </span>
  </div>
</template>

<style scoped>
.budget-alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 16px;
}

.budget-alert.warning {
  background: var(--warning-light);
  color: var(--warning);
  border: 1px solid var(--warning);
}

.budget-alert.danger {
  background: var(--danger-light);
  color: var(--danger);
  border: 1px solid var(--danger);
}

.alert-icon {
  font-size: 14px;
}
</style>
