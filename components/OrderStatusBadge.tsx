const STATUS_COLORS: Record<string, { bg: string; color: string; label: string }> = {
  pending: { bg: '#FEF3C7', color: '#92400E', label: 'Pending' },
  confirmed: { bg: '#DBEAFE', color: '#1E40AF', label: 'Confirmed' },
  preparing: { bg: '#EDE9FE', color: '#6D28D9', label: 'Preparing' },
  out_for_delivery: { bg: '#FFEDD5', color: '#C2410C', label: 'Out for Delivery' },
  delivered: { bg: '#D1FAE5', color: '#065F46', label: 'Delivered' },
  cancelled: { bg: '#FEE2E2', color: '#991B1B', label: 'Cancelled' },
}

export default function OrderStatusBadge({ status }: { status: string }) {
  const s = STATUS_COLORS[status] || { bg: '#F3F4F6', color: '#6B7280', label: status }
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 700,
      background: s.bg,
      color: s.color,
      textTransform: 'capitalize',
      letterSpacing: '0.3px',
    }}>
      {s.label}
    </span>
  )
}
