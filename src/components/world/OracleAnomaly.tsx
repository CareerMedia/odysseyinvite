export function OracleAnomaly({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="oracle-anomaly" aria-hidden="true">
      <div className="anomaly-scan" />
      <div className="anomaly-geo" />
      <div className="anomaly-constellation" />
    </div>
  )
}
