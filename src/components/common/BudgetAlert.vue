<script setup>
import { computed } from 'vue'
import { planBudgetStatus } from '../../services/selectors'
import { formatMoney } from '../../utils/format'

const props = defineProps({
  plan: { type: Object, required: true },
})

// 直接基于响应式 plan 派生，记录增删改后提示实时更新
const status = computed(() => planBudgetStatus(props.plan))

const message = computed(() => {
  if (status.value.level === 'danger') {
    if (status.value.ratio === 1) {
      return `累计花费已达到预算 100%，金额为 ${formatMoney(status.value.spend)}，请控制后续支出`
    }
    return `累计花费已超出预算（${status.value.percent}%），超支 ${formatMoney(
      status.value.spend - status.value.budget
    )}`
  }
  return `累计花费已达预算 ${status.value.percent}%（${formatMoney(status.value.spend)} / ${formatMoney(
    status.value.budget
  )}），接近预算上限`
})
</script>

<template>
  <div v-if="status.level !== 'none'" class="budget-alert" :class="status.level" role="alert">
    <span class="alert-icon">!</span>
    <span class="alert-text">
      <strong>{{ status.level === 'danger' ? '预算告警' : '预算预警' }}</strong>
      {{ message }}
    </span>
  </div>
</template>

<style scoped>
.budget-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: var(--radius-sm);
  padding: 10px 14px;
  margin-bottom: 16px;
  font-size: 13px;
  line-height: 1.5;
}

.budget-alert.warning {
  background: var(--warning-light);
  color: #92400e;
  border: 1px solid #fde68a;
}

.budget-alert.danger {
  background: var(--danger-light);
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-icon {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
}

.warning .alert-icon {
  background: var(--warning);
}

.danger .alert-icon {
  background: var(--danger);
}

.alert-text strong {
  margin-right: 6px;
}
</style>
