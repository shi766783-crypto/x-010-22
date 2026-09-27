import { EXPENSE_CATEGORIES } from '../constants'
import { luggageCompletionRate } from './luggage'

function toNum(value) {
  return Number(value) || 0
}

// 单次出行总花费
export function planTotalSpend(plan) {
  return (plan.records || []).reduce(
    (sum, r) =>
      sum +
      toNum(r.transportCost) +
      toNum(r.mealCost) +
      toNum(r.ticketCost) +
      toNum(r.shoppingCost) +
      toNum(r.otherCost),
    0
  )
}

// 预算预警阈值：累计花费达到预算八成即预警
export const BUDGET_WARN_RATIO = 0.8

// 预算预警状态：none（不提示）/ warning（黄色，≥80%）/ danger（红色，≥100%）
// 预算为 0 或未填写时一律不触发
export function planBudgetStatus(plan) {
  const budget = toNum(plan.budget)
  const spend = planTotalSpend(plan)
  if (budget <= 0) {
    return { level: 'none', budget, spend, ratio: 0, percent: 0 }
  }
  const ratio = spend / budget
  let level = 'none'
  if (ratio >= 1) level = 'danger'
  else if (ratio >= BUDGET_WARN_RATIO) level = 'warning'
  return { level, budget, spend, ratio, percent: Math.round(ratio * 100) }
}

// 单次出行花费分类汇总
export function planSpendBreakdown(plan) {
  const records = plan.records || []
  return EXPENSE_CATEGORIES.reduce((acc, { key, label }) => {
    acc[label] = records.reduce((sum, r) => sum + toNum(r[key]), 0)
    return acc
  }, {})
}

// 单次出行行李打包完成率（各成员平均）
export function planPackingRate(plan) {
  const lists = plan.luggage || []
  if (!lists.length) return 0
  const sum = lists.reduce((s, l) => s + luggageCompletionRate(l.items), 0)
  return Math.round(sum / lists.length)
}

// 单次出行待办完成进度（0-100）
export function planTodoProgress(plan) {
  const todos = plan.todos || []
  if (!todos.length) return 0
  return Math.round((todos.filter((t) => t.done).length / todos.length) * 100)
}

// 判断待办是否全部完成
export function planTodosAllDone(plan) {
  const todos = plan.todos || []
  return todos.length > 0 && todos.every((t) => t.done)
}
